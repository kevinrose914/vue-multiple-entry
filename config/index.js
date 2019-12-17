const path = require('path');

module.exports = {
    build: {
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsPublicPath: '/'
    },
    dev: {
        assetsPublicPath: '/'
    }
};