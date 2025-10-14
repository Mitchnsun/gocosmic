export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'tech', 'chore']],
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [0],
    'subject-max-length': [2, 'always', 69],
    'body-leading-blank': [0],
    'footer-leading-blank': [0],
  },
};
