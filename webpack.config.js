const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: false
      }),
    ],
    moduleIds: 'named',
  },
  entry: {
    path: path.resolve(__dirname, 'src/index.js')
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'drupaltoken.js',
    library: ['CKEditor5', 'drupalToken'],
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: [ 'raw-loader' ]
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./ckeditor5/build/ckeditor5-dll.manifest.json'),
      scope: 'ckeditor5/src',
      name: 'CKEditor5.dll',
    })
  ]
};
