
const path = require('path');

const CopyWebpackPlugin     = require('copy-webpack-plugin'),
      HtmlWebpackPlugin     = require('html-webpack-plugin'),
      MiniCssExtractPlugin  = require('mini-css-extract-plugin'),
      HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const PACKAGE = require('./package.json');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {

  entry: {
    app: './src/entry.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'resources/[name].bundle.js',
    publicPath: ''
  },

  module: {
    rules: [
      {
        test: /\.(jsx?)$/i,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/varyd-utils')
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                'lodash',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-class-properties'
              ]

            }
          }
        ]
      },
      {
        test: /\.(html)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(css|scss)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          isDev ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              importLoaders: 1
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev
            }
          },
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'resources/images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(ttf|otf|eot|woff|woff2)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'resources/fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(mp3|aif|aiff|wav)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'resources/audio/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'resources/video/[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: `src/include`,
        to: '.'
      },
      {
        from: `node_modules/react/umd/react.${isDev ? 'development' : 'production.min'}.js`,
        to: './resources/externals/react/'
      },
      {
        from: `node_modules/react-dom/umd/react-dom.${isDev ? 'development' : 'production.min'}.js`,
        to: './resources/externals/react/'
      }
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      filename: 'index.html',
      title: PACKAGE.productName
    }),
    new HtmlWebpackTagsPlugin({
      tags: [
        `resources/externals/react/react.${isDev ? 'development' : 'production.min'}.js`,
        `resources/externals/react/react-dom.${isDev ? 'development' : 'production.min'}.js`
      ],
      append: false
    }),
    new MiniCssExtractPlugin({
      filename: 'resources/styles/[name].css',
      chunkFilename: '[id].css'
    })
  ]

};
