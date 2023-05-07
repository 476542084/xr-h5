"use strict";

const path = require("path");
const webpack = require("webpack");
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const { secret } = require('./nodeRequsest')
// const suffix = secret === 'cf72fdb05f4fedf2c91fcd4127c4757e' ? 'UAT'  : secret === '0a5f089716e536f74fc68426eb31d065'  ? 'dev' : ''
module.exports = {
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  pwa: {
    iconPaths: {
      favicon32: "favicon.ico",
      favicon16: "favicon.ico",
      appleTouchIcon: "favicon.ico",
      maskIcon: "favicon.ico",
      msTileImage: "favicon.ico",
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
};
