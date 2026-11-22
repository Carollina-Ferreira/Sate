module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/controllers/**/*.js',
    'src/middleware/**/*.js',
    '!src/controllers/**/__mocks__/**'
  ],
  // O conjunto de controllers aumentou com a integração mobile e a cobertura
  // ainda está sendo expandida. Reportar todas as métricas sem mascarar a base.
  // Restaurar um limite global quando toda a nova superfície estiver coberta.
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov']
};
