const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const config = require('../config/index.js');
const htmlWebpackPlugin = require('html-webpack-plugin');
const vueLoaderPlugin = require('vue-loader/lib/plugin');
const autoprefixer = require('autoprefixer')

const resolve = (filepath) => path.resolve(__dirname, filepath)
// 静态资源的存储路径
const join = (filepath) => path.posix.join('static', filepath)

/**
 * 根据路径组装webpack入口
 * @param {模块路径} path 
 */
function getEntries(outpath) {
    var files = glob.sync(outpath), entries = {};
    files.forEach(function(filePath) {
        var splitAry = filePath.split('/');
        // 获取入口名称
        var entryName = splitAry[splitAry.length - 2];
        // 组装入口
        entries[entryName] = path.resolve(__dirname, '..', filePath);
    })
    return entries
}

// 生成样式相关的loader
const generalStyleLoader = (options) => {
    const { sourceMap, extract, usePostCSS, preprocessor } = options
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap
        }
    }
    const postCssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap,
            plugins: () => [
                autoprefixer()
            ]
        }
    }
    const styleLoader = {
        loader: 'style-loader'
    }
    let loaders = usePostCSS ? [cssLoader, postCssLoader] : [cssLoader]
    if (preprocessor) {
        loaders.push({
            loader: `${preprocessor.name}-loader`,
            options: Object.assign({}, preprocessor.option, { sourceMap })
        })
    }
    if (!extract) {
        loaders = [styleLoader].concat(loaders)
    }
    // sass, less, stylus, styl
    return {
        test: new RegExp('\\.(' + preprocessor.name + '|css)$'),
        use: loaders,
        exclude: /node_modules/
    }
}

var entries = getEntries('src/views/**/index.js');
var webpackConfig = {
    mode: 'development',
    entry: entries,
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: 'js/[name].[hash:5].js',
        chunkFilename: 'js/[name].[chunkhash:7].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader'],
                include: [resolve('../src/views/')],
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: ['babel-loader?cacheDirectory=true'],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            generalStyleLoader({
                sourceMap: true,
                extract: false,
                usePostCSS: true,
                preprocessor: { name: 'less' }
            }),
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: join('/img/[name].[hash:7].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: join('/media/[name].[hash:7].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: join('/fonts/[name].[hash:7].[ext]')
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new vueLoaderPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../dist/vendor-manifest.json'),
        })
    ],
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        }
    }
}

// 循环入口，生成与之对应的html模板
Object.keys(entries).forEach(entryName => {
    var plugin = new htmlWebpackPlugin({
        filename: './views/' + entryName + '.html', // 统一把html放入dist下的views文件夹中
        template: path.dirname(entries[entryName]) + '/index.html',
        inject: true,
        chunks: [entryName, 'manifest']
    });
    webpackConfig.plugins.push(plugin);
});

module.exports = webpackConfig;