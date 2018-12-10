const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = (env, argv) => {
  let mode = argv.mode;
  let outputFilename = '[name].[hash].bundle.js'
  let publicPath = '/'
  return {
    output: {
      publicPath: publicPath,
      path: path.resolve(__dirname, 'dist/frontend'),
      filename: outputFilename
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.scss$/,
          use: [
            mode === 'development'
              ? 'vue-style-loader'
              : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: path.resolve(__dirname, './src/vars.scss')
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            mode === 'development'
              ? 'vue-style-loader'
              : MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            'file-loader',
            'image-webpack-loader'
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      minimizer: [
        new UglifyJsPlugin({}),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].bundle.css'
      }),
      new HTMLWebpackPlugin({
        template: './src/index.html',
        favicon: './src/images/favicon.ico'
      })
    ],
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      },
      extensions: ['*', '.js', '.vue', '.json']
    },
    devtool: 'inline-source-map',
    devServer: {
      historyApiFallback: true
    }
  }
};
