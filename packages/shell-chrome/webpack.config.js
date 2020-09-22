const path = require('path')
const { createConfig } = require('@spider-rulegen/build-tools')

module.exports = createConfig({
    entry: {
        backend: './src/backend.js',
        background: './src/background.js',
        devtools: './src/devtools.js',
        'devtools-panel': './src/devtools-panel.js',
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    devtool: process.env.ENV !== 'production'
        ? '#inline-source-map'
        : false
})
