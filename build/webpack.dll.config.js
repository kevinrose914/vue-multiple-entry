const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: {
        vendor: ['vue', 'vue-router']
    },
    output: {
        path: path.join(__dirname, '../dist/js'),
        filename: '[name].dll.js',
        library: '[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            context: __dirname,
            path: path.join(__dirname, '../dist', '[name]-manifest.json'),
            name: '[name]'
        })
    ]
};