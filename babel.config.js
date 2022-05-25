module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ts', '.tsx', '.jsx', '.js', '.json', '.svg', '.jpg'],
        alias: {
          animationScreens: './src/Components/AnimationScreens',
          home: './src/Components/Home',
          helpers: './src/helpers/helpers',
        },
      },
    ],
  ],
};
