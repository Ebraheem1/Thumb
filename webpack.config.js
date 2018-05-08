const path = require('path');
const fs = require('fs');
//Those are the modules we need to skip as we require them in the leap-Controller
//and also bundle.js requires them
//var skippedModules = ['leapjs', 'gl-matrix', 'underscore', 'ws', 'events'];
// var nodeModules = {};
// fs.readdirSync('node_modules')
//   .filter(function(x) {
//     return ['.bin'].indexOf(x) === -1;
//   })
//   .forEach(function(mod) {
//     if( ! skippedModules.includes(mod)){
//       nodeModules[mod] = 'commonjs ' + mod;
//     }
//   });

module.exports = {
  entry: './src/thumbClassifier.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
/**
 * ,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'ify-loader'
      }
    ]
  }
 */