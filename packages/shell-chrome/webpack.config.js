const path = require('path')
const { createConfig } = require('@spider-rulegen/build-tools')

module.exports = createConfig({
    entry: {
        inject: './src/inject.js',
        background: './src/background.js',
        contentScriptsStart: './src/content/contentScriptsStart.js',
        contentScriptsEnd: './src/content/contentScriptsEnd.js',
        contentScriptsIdle: './src/content/contentScriptsIdle.js'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    devtool: process.env.ENV !== 'production'
        ? '#inline-source-map'
        : false
})
