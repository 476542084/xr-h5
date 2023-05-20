"use strict";

// const path = require("path");
// const webpack = require("webpack");
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
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      },
    },
  },
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    pcIndex: {
      // page 的入口
      entry: "src/main-pc.js",
      // 模板来源
      template: "public/indexPc.html",
      // 在 dist/index.html 的输出
      filename: "pcIndex.html",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "pcIndex"],
    },
  },
};
