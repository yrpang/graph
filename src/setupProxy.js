const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.lnception.cn',
      changeOrigin: true,
      pathRewrite: {
        '/api': '',
      },
    })
  )
}
