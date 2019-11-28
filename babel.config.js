let env = process.env.BABEL_ENV || process.env.NODE_ENV

let config
if (env === 'prepare') {
  config = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ]
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }
} else {
  config = {
    presets: [
      '@vue/app'
    ]
  }
}

module.exports = config
