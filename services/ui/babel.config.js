const path = require('path')
const babelPluginModuleResolver = require('babel-plugin-module-resolver')

module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3,
        "targets": "> 0.25%, not dead",
      }
    ],
    "@babel/preset-react"
  ],
  plugins: [
    [babelPluginModuleResolver, {
      root: [path.resolve(__dirname, 'src')],
      alias: {
        "@src": path.resolve(__dirname, 'src'),
        "@components": path.resolve(__dirname, 'src', 'components'),
        "@utils": path.resolve(__dirname, 'src', 'utils'),
      },
    }]
  ]
}