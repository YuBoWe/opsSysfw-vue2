// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: {
//     proxy: {
//       '/api/v1': {
//         target: 'http://127.0.0.1:8000',
//         pathRewrite: { '^/api/v1': '/' }
//       }
//     }
//   }
// })

module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production',
      config => {
        config.plugin('html').tap(args => {
          args[0].title = 'oo运维平台'
          return args
        })
      },
      config => {
        config.devServer.proxy({
          '/api/v1': {
            target: 'http://localhost:8000',
            changeOrigin: true,
            pathRewrite: { '^/api/v1': '' }
          }
        })
        console.log('~~~~~~~~~~~~')
        config.plugin('html').tap(args => {
          args[0].title = 'oo运维平台-dev'
          return args
        })
      }
    )
  }
}
