#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function readIfExists(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (_) {
    return '';
  }
}

function loadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (_) {
    return null;
  }
}

function findWorkspaceRoot() {
  // Assume script is run from workspace root; else climb up until package.json exists
  let dir = process.cwd();
  while (dir && dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    dir = path.dirname(dir);
  }
  return process.cwd();
}

function parseExceptions(md) {
  const rules = new Set();
  const lines = md.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/\brule\s*:\s*([A-Z0-9_\-]+)/i);
    if (m) rules.add(m[1].toUpperCase());
  }
  return rules;
}

function main() {
  const root = findWorkspaceRoot();
  const govIndexPath = path.join(root, 'governance', 'index.json');
  const govIndex = loadJson(govIndexPath);
  if (!govIndex) {
    console.error(JSON.stringify({ status: 'fail', error: `Missing or invalid governance index at ${govIndexPath}` }, null, 2));
    process.exit(1);
  }

  const artifacts = govIndex.artifacts || {};
  const planPath = path.join(root, artifacts.plan || '');
  const specPath = path.join(root, artifacts.spec || '');
  const tasksPath = path.join(root, artifacts.tasks || '');

  const envExample = readIfExists(path.join(root, '.env.example'));
  const schemaPrisma = readIfExists(path.join(root, 'packages', 'database', 'prisma', 'schema.prisma'));
  const webJestConfig = readIfExists(path.join(root, 'apps', 'web', 'jest.config.ts'));
  const webPkgJson = loadJson(path.join(root, 'apps', 'web', 'package.json')) || {};

  const exceptionsMd = readIfExists(path.join(root, 'specs', '001-walking-skeleton', 'exceptions.md'));
  const exceptions = parseExceptions(exceptionsMd);

  const violations = [];
  const waived = [];

  // Phase detection (simple default); allow override via env
  const phase = process.env.GOV_PHASE?.toLowerCase() || 'phase1';

  // Rule: Phase 1 DB URL must be direct (no pgbouncer, no DIRECT_URL)
  if (phase === 'phase1') {
    if (/pgbouncer/i.test(envExample) || /DIRECT_URL\s*=/.test(envExample)) {
      const v = { rule: 'PHASE1_DB_URL', file: '.env.example', message: 'Phase 1: direct PostgreSQL (5432); no pgbouncer params or DIRECT_URL' };
      (exceptions.has(v.rule) ? waived : violations).push(v);
    }
  }

  // Rule: schema.prisma must not use directUrl in Phase 1
  if (phase === 'phase1') {
    if (/\bdirectUrl\b/i.test(schemaPrisma)) {
      const v = { rule: 'PRISMA_DIRECTURL', file: 'packages/database/prisma/schema.prisma', message: 'Phase 1: Prisma datasource must not use directUrl' };
      (exceptions.has(v.rule) ? waived : violations).push(v);
    }
  }

  // Rule: Phase 1 coverageThreshold should be 10
  if (phase === 'phase1') {
    const has10 = /branches\s*:\s*10/.test(webJestConfig) && /functions\s*:\s*10/.test(webJestConfig) && /lines\s*:\s*10/.test(webJestConfig) && /statements\s*:\s*10/.test(webJestConfig);
    if (!has10) {
      const v = { rule: 'PHASE1_COVERAGE', file: 'apps/web/jest.config.ts', message: 'Phase 1: coverageThreshold must be 10% (raise later per plan)' };
      (exceptions.has(v.rule) ? waived : violations).push(v);
    }
  }

  // Rule: MSW required in UI devDependencies
  const devDeps = (webPkgJson.devDependencies || {});
  if (!devDeps['msw']) {
    const v = { rule: 'MSW_REQUIRED', file: 'apps/web/package.json', message: 'UI packages must include msw in devDependencies' };
    (exceptions.has(v.rule) ? waived : violations).push(v);
  }

  const report = {
    status: violations.length ? 'fail' : 'pass',
    phase,
    checked: {
      plan: fs.existsSync(planPath),
      spec: fs.existsSync(specPath),
      tasks: fs.existsSync(tasksPath)
    },
    violations,
    waived: Array.from(waived)
  };

  if (violations.length) {
    console.error(JSON.stringify(report, null, 2));
    process.exit(1);
  } else {
    console.log(JSON.stringify(report, null, 2));
    process.exit(0);
  }
}

main();


