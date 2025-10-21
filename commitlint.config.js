module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'chore', 'cfg', 'plan', 'zdx'],
    ],
    // Disable other conventional commit rules - only enforce type-enum
    'header-max-length': [0],
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
    'subject-case': [0],
    'subject-full-stop': [0],
  },
};
