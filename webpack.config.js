const path = require('path');

module.exports = {
  entry: './src/leapController.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};