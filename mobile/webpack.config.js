const webpack = require('@nativescript/webpack');
module.exports = env => {
  webpack.init(env);
  webpack.chainWebpack(config => {
    config.devServer.hotOnly(true);
    config.devServer.hot(true);
  });
  return webpack.resolveConfig();
};
