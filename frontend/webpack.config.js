const path = require('path');

const outputDir = path.join(__dirname, 'build/static/');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: path.join(__dirname, 'src/Index.bs.js'),
  mode: isProd ? 'production' : 'development',
  output: {
    path: outputDir,
    publicPath: outputDir,
    filename: 'index.js',
  },
};

