const path = require('path');
const NodemonPlugin = require( 'nodemon-webpack-plugin' )
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

path.resolve(__dirname, "server")
module.exports = {
    target: 'node',
    entry: './server/src/index.js',
    node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: true,
		__dirname: true
	},
    output: {
       path: path.resolve(__dirname, 'server/dist'),
       filename: 'bundle.js',
       publicPath: "/assets/",
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            options: {
              presets: ["env"]
            }
         },{
            test: /\.js$/,
            loader: 'shebang-loader'
         }]
    },
    devtool: 'eval-source-map',
    externals: [nodeExternals()],
    plugins: [
            new NodemonPlugin()
    ],
    watch: true
}