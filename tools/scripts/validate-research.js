#!/usr/bin/env node

/**
 * Validates that research-validation.md exists when spec documents are modified
 *
 * Usage: node tools/scripts/validate-research.js
 *
 * Checks:
 * 1. Detects changes to specs/**\/(plan|spec|contracts|data-model|quickstart).md
 * 2. For each changed spec directory, checks if research-validation.md exists
 * 3. Fails if research-validation.md is missing
 *
 * Exit codes:
 * 0 - Success (all validations passed)
 * 1 - Failure (missing research-validation.md)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get changed files from git (comparing with base branch)
function getChangedFiles(base = 'main') {
  try {
    const output = execSync(`git diff --name-only ${base}...HEAD`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return output.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error getting changed files:', error.message);
    // If git diff fails, check staged files instead
    try {
      const stagedOutput = execSync('git diff --cached --name-only', {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return stagedOutput.split('\n').filter(Boolean);
    } catch (stagedError) {
      console.error('Error getting staged files:', stagedError.message);
      return [];
    }
  }
}

// Extract spec directories that have material document changes
function getAffectedSpecDirs(changedFiles) {
  const specDirs = new Set();
  const materialDocPattern =
    /^specs\/([^/]+)\/(plan|spec|contracts|data-model|quickstart)\.md$/;

  changedFiles.forEach((file) => {
    const match = file.match(materialDocPattern);
    if (match) {
      specDirs.add(`specs/${match[1]}`);
    }
  });

  return Array.from(specDirs);
}

// Check if research-validation.md exists in spec directory
function hasResearchValidation(specDir) {
  const researchValidationPath = path.join(
    process.cwd(),
    specDir,
    'research-validation.md'
  );
  return fs.existsSync(researchValidationPath);
}

// Check if research.md exists in spec directory
function hasResearchMd(specDir) {
  const researchPath = path.join(process.cwd(), specDir, 'research.md');
  return fs.existsSync(researchPath);
}

// Main validation logic
function validateResearch() {
  console.log('🔍 Validating research documentation...\n');

  const changedFiles = getChangedFiles();
  console.log(`Changed files: ${changedFiles.length}`);

  const affectedSpecDirs = getAffectedSpecDirs(changedFiles);

  if (affectedSpecDirs.length === 0) {
    console.log('✅ No spec document changes detected - validation skipped\n');
    return 0;
  }

  console.log(
    `\nSpec directories with material changes: ${affectedSpecDirs.length}`
  );
  affectedSpecDirs.forEach((dir) => console.log(`  - ${dir}`));
  console.log('');

  const missingResearch = [];
  const softPass = [];

  affectedSpecDirs.forEach((specDir) => {
    const hasRV = hasResearchValidation(specDir);
    if (!hasRV) {
      if (hasResearchMd(specDir)) {
        // No research-validation.md, but research.md exists → allow pass (no material changes assumed)
        softPass.push(specDir);
      } else {
        missingResearch.push(specDir);
      }
    }
  });

  if (missingResearch.length > 0) {
    console.error('❌ VALIDATION FAILED\n');
    console.error(
      'The following spec directories have material changes but are missing research-validation.md:\n'
    );
    missingResearch.forEach((dir) =>
      console.error(`  - ${dir}/research-validation.md`)
    );
    console.error('\n💡 Resolution:');
    console.error(
      '   1. Run /speckit.plan to produce research.md and (if material changes) research-validation.md'
    );
    console.error('   2. If no material changes, research.md is sufficient');
    console.error('   3. Ensure Phase 0 gates are completed\n');
    console.error(
      '📖 See: .specify/memory/constitution.md - Principle X (External Validation is Mandatory)\n'
    );
    return 1;
  }

  if (softPass.length > 0) {
    console.log(
      'ℹ️  research-validation.md missing but research.md present for:'
    );
    softPass.forEach((dir) => console.log(`  - ${dir}`));
    console.log('    Passing validation (no material changes assumed)\n');
  }

  console.log('✅ Research documentation validated\n');
  return 0;
}

// Execute validation
const exitCode = validateResearch();
process.exit(exitCode);
