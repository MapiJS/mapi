var webpack = require('webpack');
var pkg = require('./package.json');

module.exports = {
	entry: ['./index'],
	output: {
		path: './dist',
		filename: 'mapi.js',
		libraryTarget: 'umd',
		library: 'Mapi'
	},
	externals: {
        "jquery": "jQuery",
        "underscore": "_"
    },
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015'],
					plugins: ['transform-object-rest-spread'],
					cacheDirectory: true
				}
			}
		]
	},
	jshint: {
		esnext: true,
		failOnHint: true
	}
};