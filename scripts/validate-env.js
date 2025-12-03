#!/usr/bin/env node
/**
 * Environment Configuration Validator
 *
 * Validates that all required environment files exist and contain
 * properly formatted variables.
 *
 * IMPORTANT: This script performs FORMAT validation only.
 * It does NOT test database connectivity or credential validity.
 * Use integration tests for connectivity validation.
 *
 * Usage:
 *   node scripts/validate-env.js
 *
 * Exit codes:
 *   0 - All validations passed
 *   1 - Validation failures detected
 */

const fs = require('fs');
const path = require('path');

// Configuration
const REQUIRED_VARS = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

// Optional variables with default values in the application
// These variables do not need to be present in .env files
const OPTIONAL_VARS = [
  {
    name: 'CORS_ORIGIN',
    description: 'Comma-separated list of allowed CORS origins',
  },
  {
    name: 'HOST',
    description: 'Server host address (defaults to localhost)',
  },
  {
    name: 'PORT',
    description: 'Server port number (defaults to 4000)',
  },
  {
    name: 'NODE_ENV',
    description: 'Node environment (defaults to development)',
  },
];

// Note: Production environment is optional and can be added later
const ENVIRONMENTS = ['development', 'test'];

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Validation state
let hasErrors = false;
let hasWarnings = false;

/**
 * Log colored message to console
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Parse .env file into key-value pairs
 */
function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const vars = {};

  // Simple .env parser (handles basic KEY=value format)
  content.split('\n').forEach((line) => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') return;

    // Match KEY=value pattern
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      // Remove quotes if present
      vars[key] = value.replace(/^["']|["']$/g, '');
    }
  });

  return vars;
}

/**
 * Validate format of a variable value
 */
function validateFormat(varName, value) {
  const errors = [];

  // DATABASE_URL validation
  if (varName === 'DATABASE_URL') {
    if (!value.startsWith('postgresql://')) {
      errors.push('Must start with "postgresql://"');
    }
    if (!value.includes(':6543/')) {
      errors.push('Should use pooled connection (port 6543)');
    }
  }

  // DIRECT_URL validation
  if (varName === 'DIRECT_URL') {
    if (!value.startsWith('postgresql://')) {
      errors.push('Must start with "postgresql://"');
    }
    if (!value.includes(':5432/')) {
      errors.push('Should use direct connection (port 5432)');
    }
  }

  // NEXT_PUBLIC_SUPABASE_URL validation
  if (varName === 'NEXT_PUBLIC_SUPABASE_URL') {
    if (!value.startsWith('https://')) {
      errors.push('Must start with "https://"');
    }
    if (!value.includes('.supabase.co')) {
      errors.push('Should be a Supabase URL (*.supabase.co)');
    }
  }

  // NEXT_PUBLIC_SUPABASE_ANON_KEY validation
  if (varName === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
    if (value.length < 20) {
      errors.push('Key seems too short (minimum 20 characters)');
    }
    // Check if it's a placeholder
    if (
      value.includes('[') ||
      value.includes('YOUR') ||
      value.includes('ANON')
    ) {
      errors.push('Contains placeholder text - needs real credential');
    }
  }

  return errors;
}

/**
 * Validate CORS_ORIGIN format
 * Allows comma-separated list of URLs
 */
function validateCorsOrigin(value) {
  const errors = [];
  const origins = value.split(',').map((origin) => origin.trim());

  origins.forEach((origin) => {
    if (!origin.startsWith('http://') && !origin.startsWith('https://')) {
      errors.push(`Origin "${origin}" must start with "http://" or "https://"`);
    }
    // Check for common mistakes
    if (origin.endsWith('/')) {
      errors.push(`Origin "${origin}" should not end with a slash`);
    }
  });

  return errors;
}

/**
 * Validate HOST format
 * Must be a valid hostname, IPv4, or IPv6 address
 */
function validateHost(value) {
  const errors = [];

  // Check for protocol prefix (always invalid)
  if (value.includes('http://') || value.includes('https://')) {
    errors.push('Should not include protocol (http:// or https://)');
    return errors; // Early return, other checks won't be meaningful
  }

  // Detect IPv6 addresses (contain colons and hex/colon characters)
  // Examples: ::1, ::, fe80::1, 2001:db8::1, [::1]
  const isIPv6 =
    value.includes(':') &&
    (value.startsWith('[') || // Bracketed IPv6: [::1]
      /^[0-9a-fA-F:]+$/.test(value) || // Pure IPv6: ::1, fe80::1
      /^[0-9a-fA-F:.]+$/.test(value)); // IPv4-mapped IPv6: ::ffff:192.0.2.1

  if (isIPv6) {
    // IPv6 validation - just check it's not empty and has valid characters
    if (!/^[[0-9a-fA-F:.]+]?$/.test(value)) {
      errors.push('Invalid IPv6 address format');
    }
  } else {
    // Hostname or IPv4 validation
    const hostnameRegex = /^[a-zA-Z0-9.-]+$/;
    if (!hostnameRegex.test(value)) {
      errors.push('Must be a valid hostname or IP address');
    }

    // For non-IPv6, colon suggests port number confusion
    if (value.includes(':')) {
      errors.push('Should not include port number (use PORT variable)');
    }
  }

  return errors;
}

/**
 * Validate PORT format
 * Must be a number between 1-65535
 */
function validatePort(value) {
  const errors = [];
  const port = Number(value);

  if (isNaN(port)) {
    errors.push('Must be a valid number');
  } else if (port < 1 || port > 65535) {
    errors.push('Must be between 1 and 65535');
  } else if (!Number.isInteger(port)) {
    errors.push('Must be an integer');
  }

  return errors;
}

/**
 * Validate NODE_ENV format
 * Must be one of: development, test, production
 */
function validateNodeEnv(value) {
  const errors = [];
  const validEnvs = ['development', 'test', 'production'];

  if (!validEnvs.includes(value)) {
    errors.push(`Must be one of: ${validEnvs.join(', ')}`);
  }

  return errors;
}

/**
 * Validate a single environment file
 */
function validateEnvironment(env) {
  const envFile = `.env.${env}.local`;
  const envPath = path.join(process.cwd(), envFile);

  // Check file exists
  if (!fs.existsSync(envPath)) {
    log(`❌ ${envFile}: File not found`, 'red');
    hasErrors = true;
    return false;
  }

  // Parse file
  let vars;
  try {
    vars = parseEnvFile(envPath);
  } catch (error) {
    log(`❌ ${envFile}: Failed to parse file`, 'red');
    log(`   Error: ${error.message}`, 'red');
    hasErrors = true;
    return false;
  }

  // Validate each required variable
  let envHasErrors = false;
  REQUIRED_VARS.forEach((varName) => {
    if (!vars[varName] || vars[varName].trim() === '') {
      log(`❌ ${envFile}: Missing or empty ${varName}`, 'red');
      hasErrors = true;
      envHasErrors = true;
      return;
    }

    // Validate format
    const formatErrors = validateFormat(varName, vars[varName]);
    if (formatErrors.length > 0) {
      log(`❌ ${envFile}: ${varName} format issues:`, 'red');
      formatErrors.forEach((error) => {
        log(`   - ${error}`, 'red');
      });
      hasErrors = true;
      envHasErrors = true;
    }
  });

  // Validate optional variables if present
  OPTIONAL_VARS.forEach(({ name: varName }) => {
    if (vars[varName] && vars[varName].trim() !== '') {
      let formatErrors = [];

      // Call the appropriate validator function
      if (varName === 'CORS_ORIGIN') {
        formatErrors = validateCorsOrigin(vars[varName]);
      } else if (varName === 'HOST') {
        formatErrors = validateHost(vars[varName]);
      } else if (varName === 'PORT') {
        formatErrors = validatePort(vars[varName]);
      } else if (varName === 'NODE_ENV') {
        formatErrors = validateNodeEnv(vars[varName]);
      }

      if (formatErrors.length > 0) {
        log(`❌ ${envFile}: ${varName} format issues:`, 'red');
        formatErrors.forEach((error) => {
          log(`   - ${error}`, 'red');
        });
        hasErrors = true;
        envHasErrors = true;
      }
    }
  });

  // Check for unexpected variables (warnings only)
  const knownVars = [...REQUIRED_VARS, ...OPTIONAL_VARS.map((v) => v.name)];
  Object.keys(vars).forEach((varName) => {
    if (!knownVars.includes(varName) && !varName.startsWith('NEXT_PUBLIC_')) {
      log(`⚠️  ${envFile}: Unexpected variable "${varName}"`, 'yellow');
      hasWarnings = true;
    }
  });

  if (!envHasErrors) {
    log(`✅ ${envFile}: All variables present and valid`, 'green');
  }

  return !envHasErrors;
}

/**
 * Validate cross-environment uniqueness
 */
function validateUniqueness() {
  const urls = {};

  ENVIRONMENTS.forEach((env) => {
    const envFile = `.env.${env}.local`;
    const envPath = path.join(process.cwd(), envFile);

    if (!fs.existsSync(envPath)) return;

    try {
      const vars = parseEnvFile(envPath);
      const url = vars['NEXT_PUBLIC_SUPABASE_URL'];

      if (url) {
        if (urls[url]) {
          log(`❌ Cross-environment validation failed:`, 'red');
          log(
            `   ${envFile} and ${urls[url]} have the same NEXT_PUBLIC_SUPABASE_URL`,
            'red'
          );
          log(
            `   Each environment should have a unique Supabase project/branch`,
            'red'
          );
          hasErrors = true;
        } else {
          urls[url] = envFile;
        }
      }
    } catch {
      // Already handled in validateEnvironment
    }
  });
}

/**
 * Main validation function
 */
function main() {
  log('\n🔍 Validating environment configuration...\n', 'cyan');

  // Validate each environment
  ENVIRONMENTS.forEach((env) => {
    validateEnvironment(env);
  });

  // Validate uniqueness across environments
  log(''); // Empty line
  validateUniqueness();

  // Print summary
  log(''); // Empty line
  if (hasErrors) {
    log('❌ Environment validation failed!', 'red');
    log('', 'reset');
    log('Common fixes:', 'yellow');
    log(
      '  1. Run the AI setup prompt from docs/project-config/supabase.md',
      'reset'
    );
    log('  2. Check for typos in .env files', 'reset');
    log('  3. Ensure no placeholder values (e.g., [PROJECT-REF])', 'reset');
    log('  4. Verify each environment has unique credentials', 'reset');
    log('', 'reset');
    process.exit(1);
  }

  if (hasWarnings) {
    log('⚠️  Environment validation passed with warnings', 'yellow');
    log('   Review unexpected variables above', 'yellow');
  } else {
    log('✅ Environment validation passed!', 'green');
  }

  log('', 'reset');
  log('Next steps:', 'cyan');
  log(
    '  1. Apply migrations: NODE_ENV=development pnpm exec prisma migrate deploy',
    'reset'
  );
  log(
    '  2. Test connectivity: NODE_ENV=development pnpm exec prisma db pull',
    'reset'
  );
  log('  3. Run tests: NODE_ENV=test pnpm exec nx run-many -t test', 'reset');
  log('', 'reset');

  process.exit(0);
}

// Run validation
main();
