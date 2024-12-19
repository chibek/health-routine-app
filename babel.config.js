module.exports = function (api) {
  api.cache(true);
  const plugins = [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          'react-native-vector-icons': '@expo/vector-icons',
        },
      },
    ],
    ['inline-import', { extensions: ['.sql'] }],
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins,
  };
};
