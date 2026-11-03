module.exports = {
  preset: '@react-native/jest-preset',
  testPathIgnorePatterns: ['/node_modules/', '/backend/', '/android/', '/ios/'],
  moduleNameMapper: {
    '^react-native-vector-icons/MaterialCommunityIcons$':
      '<rootDir>/__mocks__/MaterialCommunityIcons.js',
  },
};
