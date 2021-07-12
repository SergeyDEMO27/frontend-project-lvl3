/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  mode: process.env.NODE_ENV || 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: false,
    }),
  ],
  watchOptions: {
    poll: 1000,
  },
  devServer: {
    hot: true,
    contentBase: './dist',
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 8080,
  },
  output: {
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.html'],
  },
};
