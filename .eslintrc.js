module.exports = {
  extends: ['expo', 'prettier'],
  rules: {
    // Temporal: Ignorar errores de router typing
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
