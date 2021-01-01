const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  mode: 'development',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development',
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    }),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src', 'components'),
      '@utils': path.resolve(__dirname, 'src', 'utils'),
    },
  },
  devServer: {
    hot: true,
    port: 8080,
    liveReload: true,
    inline: true,
    host: '0.0.0.0',
    historyApiFallback: true,
    disableHostCheck: true,
  },
};
