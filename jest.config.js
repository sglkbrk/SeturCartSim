module.exports = {
  preset: 'jest-expo',
  setupFiles: [
    './jest.setup.js', // varsa veya şimdi oluşturacağız
  ],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/(?!(jest-)?@?expo|@expo/vector-icons|react-native|react-navigation|@react-native|@react-native-community)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.tsx',
    '!src/setupTests.ts',
    '!src/components/**/index.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.style.ts',
    '!src/styles/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
