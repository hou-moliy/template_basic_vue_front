'use strict';
const path = require('path');
const defaultSettings = require('./src/settings.js');
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 解决H5缓存问题
let filePath = 'js/'; //打包文件存放文件夹路径
let Timestamp = '.' + new Date().getTime();//时间戳
function resolve (dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || '管理平台'; // page title
const port = process.env.port || process.env.npm_config_port || 9528; // dev port

module.exports = {
  publicPath: process.env.VUE_APP_PROJECT_PATH || '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port: port,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // 公用代理-admin
      [process.env.VUE_APP_BASE_API]: {
        target: `http://10.1.63.202/test/api/adminLnK8s`, // k8s测试服务器
        // target: `http://10.1.63.202:9503/admin`, // 测试服务器
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      },
      // 公共的静态资源代理
      [process.env.VUE_APP_STATIC_IMGS]: {
        target: "http://10.1.63.203:8050/",
        changeOrigin: true
      }
    }
  },
  configureWebpack: config => {
    config.name = name;
    config.resolve = {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        "@": resolve("src")
      }
    };

    if (process.env.NODE_ENV === 'prod') {
      // 输出重构  打包编译后的 文件名称  【模块名称.时间戳.js】 解决js缓存问题
      config.output.filename = `${filePath}[name]${Timestamp}.js`;
      config.output.chunkFilename = `${filePath}[name]${Timestamp}.js`;
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,//生产环境自动删除debugger
              drop_console: true, //生产环境自动删除console
              pure_funcs: ['console.log']
            },
            warnings: false
          },
          sourceMap: false, //关掉sourcemap 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
          parallel: true //使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
        }),
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: /\.js$|\.html$|\.json$|\.css/,
          threshold: 10240,// 对超过10k的数据压缩
          deleteOriginalAssets: false, // 不删除源文件
          minRatio: 0.8
        })
      );
      // 开启分离js
      config.optimization = {
        nodeEnv: false,// 解决webpack5不能自定义环境名称问题
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 2000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name (module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                return `npm.${packageName.replace('@', '')}`;
              }
            }
          }
        }
      };
      config.plugins = [...config.plugins];
    } else {
      config.optimization = {
        nodeEnv: false// 解决webpack5不能自定义环境名称问题
      };
    }

  },
  chainWebpack (config) {
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ]);
    config.plugins.delete('prefetch');
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end();
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial'
                },
                elementUI: {
                  name: 'chunk-elementUI',
                  priority: 20,
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'),
                  minChunks: 3,
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            });
          config.optimization.runtimeChunk('single');
        }
      );
  }
};
