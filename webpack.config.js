var webpack = require('webpack');
var pkg = require('./package.json');

module.exports = {
	entry: ['./index'],
	output: {
		libraryTarget: 'umd',
		library: 'Mapi'
	},
	externals: {
        "jquery": "jQuery",
        "underscore": "_"
    },
	module: {		
		preLoaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader'
			}
		],
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
	plugins: [
		new webpack.BannerPlugin([
				pkg.name + ' - ' + pkg.description,
				'Version: ' + pkg.version,
				'Author: ' + pkg.author
			].join('\n'), {entryOnly: true})
	],
	eslint: {
		parser: "babel-eslint"
		
	}
};