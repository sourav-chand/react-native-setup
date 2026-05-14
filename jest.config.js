module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|nativewind|react-native-css-interop|react-native-reanimated|react-native-worklets)/)',
  ],
};
