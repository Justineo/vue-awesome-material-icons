module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'demo',
  chainWebpack: config => {
    config
      .entry('app')
      .clear()
      .add('./demo-src/main.js')
  }
}
