const express = require('express');
const webpack = require('webpack');
const path = require('path');
const webpackConfig = require('./webpack.base.js');

var app = express();
// webpack编译器
var compiler = webpack(webpackConfig);

// webpack-dev-server中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
});

app.use(devMiddleware);

app.get('/:viewname?', function(req, res, next) {
    console.log('req:', req.url);
    const siteName = req.params.viewname;
    const siteNames = ['siteA', 'siteB', 'siteC'];
    if (!siteName || !siteNames.includes(siteName)) {
        res.end();
        return;
    }
    var viewname = siteName ? siteName + '.html' : 'index.html';
    var filepath = path.join(compiler.outputPath, 'views', viewname);
    console.log('filepath:', filepath);
    compiler.outputFileSystem.readFile(filepath, (err, result) => {
        if (err) {
            return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});

module.exports = app.listen(8086, (err) => {
    if (err) return;
    console.log('Listening at http://localhost:8086');
})