// commitlint.config.js — KI Agency Commit Linting
module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^\[([A-Z][A-Z0-9-]+)\] (\w+)(?:\(([^)]+)\))?: (.+)/,
      headerCorrespondence: ['agentPrefix', 'type', 'scope', 'subject'],
    },
  },
  rules: {
    'header-max-length': [2, 'always', 120],
    'header-min-length': [2, 'always', 20],
  },
};
