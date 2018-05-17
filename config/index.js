// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    browserSupport: path.resolve(__dirname, '../dist/browserSupport.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 3333,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/wxconfigapi': {
        target: 'http://10.99.1.133:12223',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/wxconfigapi': ''
        }
      },
      '/partner': {
        target: 'http://10.99.1.131:30091',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/partner': ''
        }
      },
      '/industry': {
        target: 'http://10.99.1.133:31091',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/industry': ''
        }
      },
      '/assenterprise': {
        target: 'http://10.99.1.133:31091',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/assenterprise': ''
        }
      },
      '/companyapi': {
        target: 'http://10.99.1.133:31091',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/companyapi': ''
        }
      },
      '/city': {
        target: 'http://10.99.1.133:12222',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/city': ''
        }
      },
      '/statistics': {
        target: 'http://10.99.1.134:12221',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/statistics': ''
        }
      },
      '/user': {
        target: 'http://10.99.1.134:55555',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/user': ''
        }
      },
      '/hdfs': {
        target: 'http://10.99.1.134:30080',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/hdfs': ''
        }
      },
      '/data': {
        target: 'http://10.99.1.134:55555',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/data': ''
        }
      },
      '/sms': {
        target: 'http://10.99.1.134:55555',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/sms': ''
        }
      },
      '/sub_template':{
        target: 'http://10.99.1.134:30080',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/sub_template': ''
        }
      },
      '/socket': {
        target: 'http://10.99.1.134:12121',//'http://10.99.1.254:3335',
        changeOrigin: true,
        pathRewrite: {
          '^/socket': ''
        }
      },
      '/privilege': {
        target: 'http://10.99.1.131:30095',
        changeOrigin: true,
        pathRewrite: {
          '^/privilege': ''
        }
      },
      '/assist_sms': {
        target: 'http://10.99.1.131:13131',
        changeOrigin: true,
        pathRewrite: {
          '^/assist_sms': ''
        }
      },
      '/hezh': {
        target: 'http://10.99.1.219:30080',
        changeOrigin: true,
        pathRewrite: {
          '^/hezh': ''
        }
      },
      '/urlhzh': {
        target: 'http://10.99.1.219:30092',
        changeOrigin: true,
        pathRewrite: {
          '^/urlhzh': ''
        }
      },
      '/capital': {
        target: 'http://10.99.1.134:55555',
        changeOrigin: true,
        pathRewrite: {
          '^/capital': ''
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
