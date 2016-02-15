const path = require('path');
const webpack = require('webpack');

const DEV_MODE = process.env.DEV_MODE == 'true' || false;
const DEV_SERVER = process.env.DEV_SERVER == 'true' || false;
const DEV_TEST = process.env.DEV_TEST == 'true' || false;

const TransferWebpackPlugin = require('transfer-webpack-plugin');

var config = {
    DEV_MODE: DEV_MODE,
    DEV_SERVER: DEV_SERVER,
    DEV_TEST: DEV_TEST,
    entry: [
        './index'
    ],
    output: {
        path: path.join(__dirname, 'static/js'),
        filename: 'app.js',
        publicPath: '/static/js/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            DEV_MODE: DEV_MODE
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                },
                exclude: /node_modules/,
                include: __dirname
            }
        ]
    }
};


if (DEV_MODE == true) {

    config.entry.push('webpack-hot-middleware/client');
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    // config.devtool = 'cheap-module-eval-source-map';

    config.module.loaders[0].query.presets.push("react-hmre");
}
if (DEV_TEST) {
    config.entry = ['./test'];
    config.output = {
        path: path.join(__dirname, 'test_build'),
        filename: 'tests.js',
        publicPath: '/test_build/'
    };
}

module.exports = config;
// When inside Redux repo, prefer src to compiled version.
// You can safely delete these lines in your project.
/*var reduxSrc = path.join(__dirname, '..', '..', 'src')
 var reduxNodeModules = path.join(__dirname, '..', '..', 'node_modules')
 var fs = require('fs')
 if (fs.existsSync(reduxSrc) && fs.existsSync(reduxNodeModules)) {
 // Resolve Redux to source
 module.exports.resolve = {alias: {'redux': reduxSrc}}
 // Our root .babelrc needs this flag for CommonJS output
 process.env.BABEL_ENV = 'commonjs'
 // Compile Redux from source
 module.exports.module.loaders.push({
 test: /\.js$/,
 loaders: ['babel'],
 include: reduxSrc
 })
 }
 */