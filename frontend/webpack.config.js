var path = require('path');
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
	devtool: 'eval-source-map',
	watch: true,
	entry: {
		//main: './src/js/main.js',
		login: './src/js/components/login/index.js'
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '../xopay/static/js/')

	},
	plugins: [
		new WebpackNotifierPlugin({title: 'XOPAY'})
	],
	module: {
		loaders: [{
				test: /\.jsx?$/,
        loader: 'react-hot!babel-loader',
        include: path.join(__dirname, './src/js')
			}]
	}
}