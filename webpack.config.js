const path = require('path');

module.exports = {
  entry: './src/thumbClassifier.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: {
    fs: 'empty'
  }
};
