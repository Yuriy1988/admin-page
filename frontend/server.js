var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');
var httpProxy = require('http-proxy');


var app = new (require('express'))();
var fs = require('fs');
var port = 3000;
var apiDelay = 1;


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
    compiler.run(function (err, stats) {
        if (!err) {
            console.log("[WEBPACK] production building finished");
        } else {
            console.error("[WEBPACK] ERROR! production building FAILED!");
        }

        if (config.DEV_TEST == true) {
            console.log("[TEST] running test");
            console.log("***")
        }
    });
}


if (config.DEV_SERVER == true) {

    var proxy = httpProxy.createProxyServer({});

    app.use(function (req, res) {

        if (req.url.substr(0, 10) === '/api/admin') {
            setTimeout(function () {
                proxy.web(req, res, {target: 'http://localhost:7128'});
            }, apiDelay);

        } else {
            //if (req.url.substr(0,5)==);
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
        }
    });

    app.listen(port, function (error) {
        if (error) {
            console.error(error)
        } else {
            console.info("[SERVER] Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
        }
    });

}

