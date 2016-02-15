var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');

var app = new (require('express'))();
var fs = require('fs');
var port = 3000;

var compiler = webpack(config);

console.log("[WEBPACK] start");
console.log("-CONFIG DEV_MODE = ", config.DEV_MODE);
console.log("-CONFIG DEV_SERVER = ", config.DEV_SERVER);
console.log("-CONFIG DEV_TEST = ", config.DEV_TEST);


if (config.DEV_MODE == true) {
    console.log("[WEBPACK] building in development");
    app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
    app.use(webpackHotMiddleware(compiler));
} else {
    console.log("[WEBPACK] building in production");
    webpack(config, function () {
        console.log("[WEBPACK] production building finished");
        if (config.DEV_TEST == true) {
            console.log("[TEST] running test");
            console.log("***")
        };
    });
}



if (config.DEV_SERVER == true) {
    app.use(function (req, res) {
        console.log("[SERVER] <-- ", req.url);

        const fileName = __dirname + req.url;

        console.log("[FILE] = ", fileName);

        fs.stat(fileName, (err, stats) => {

            if (!err && stats.isFile()) {
                console.log("[SERVER] --> ", fileName);
                res.sendFile(fileName);
            } else {
                console.log("[SERVER] --> INDEX.HTML");
                res.sendFile(__dirname + '/static/index.html');
            }
        });


    });

    app.listen(port, function (error) {
        if (error) {
            console.error(error)
        } else {
            console.info("[SERVER] Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
        }
    });

}

