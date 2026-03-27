'use strict';
/*eslint-env node*/
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var path = require('path');

module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    var BUILD = !!options.BUILD;
    var TEST = !!options.TEST;
    var E2E = !!options.E2E;
    var DEV = !!options.DEV;

    var config = {};

    /**
     * Mode
     * Reference: https://webpack.js.org/configuration/mode/
     */
    config.mode = BUILD ? 'production' : 'development';

    /**
     * Entry
     */
    if(TEST) {
        config.entry = {};
    } else {
        config.entry = {
            app: './client/app/app.js',
            polyfills: './client/polyfills.js',
            vendor: [
                'angular',
                'angular-animate',
                'angular-aria',
                'angular-cookies',
                'angular-resource',
                'angular-sanitize',
                'angular-socket-io',
                'angular-ui-bootstrap',
                'angular-ui-router',
                'lodash'
            ]
        };
    }

    /**
     * Output
     */
    if(TEST) {
        config.output = {};
    } else {
        config.output = {
            path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),
            publicPath: BUILD || DEV || E2E ? '/' : `http://localhost:${8080}/`,
            filename: BUILD ? '[name].[contenthash].js' : '[name].bundle.js',
            chunkFilename: BUILD ? '[name].[contenthash].js' : '[name].bundle.js'
        };
    }

    if(TEST) {
        config.resolve = {
            modules: ['node_modules'],
            extensions: ['.js', '.ts']
        };
    }

    /**
     * Devtool
     */
    if(TEST) {
        config.devtool = 'inline-source-map';
    } else if(BUILD || DEV) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    /**
     * Loaders / Rules
     */
    config.module = {
        rules: [
            {
                // JS LOADER
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', { modules: 'commonjs' }]],
                    plugins: ['@babel/plugin-proposal-class-properties']
                },
                include: [
                    path.resolve(__dirname, 'client/'),
                    path.resolve(__dirname, 'node_modules/lodash-es/')
                ]
            },
            {
                // TS LOADER
                test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.client.json'),
                        transpileOnly: true
                    }
                }],
                include: [path.resolve(__dirname, 'client/')]
            },
            {
                // ASSET LOADER
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*)?$/,
                loader: 'file-loader'
            },
            {
                // HTML LOADER
                test: /\.html$/,
                use: [{ loader: 'raw-loader', options: { esModule: false } }]
            },
            {
                // CSS LOADER
                test: /\.css$/,
                use: !TEST
                    ? [
                        MiniCssExtractPlugin.loader,
                        { loader: 'css-loader', options: { url: false } },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [autoprefixer({ overrideBrowserslist: ['last 2 versions'] })]
                                }
                            }
                        }
                      ]
                    : 'null-loader'
            },
            {
                // SASS LOADER
                test: /\.(scss|sass)$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { url: false } },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                quietDeps: true,
                                silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'slash-div', 'if-function']
                            }
                        }
                    }
                ],
                include: [
                    path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets'),
                    path.resolve(__dirname, 'client/app/app.scss')
                ]
            },
            {
                // NG-ANNOTATE (post-process JS)
                test: /\.js$/,
                enforce: 'post',
                loader: 'ng-annotate-loader',
                options: { single_quotes: true }
            }
        ]
    };

    // ISTANBUL INSTRUMENTER for test coverage
    if(TEST) {
        config.module.rules.push({
            test: /\.js$/,
            exclude: /(node_modules|spec\.js|mock\.js)/,
            enforce: 'pre',
            use: {
                loader: 'istanbul-instrumenter-loader',
                options: { esModules: true }
            }
        });
    }

    /**
     * Plugins
     */
    config.plugins = [
        new MiniCssExtractPlugin({
            filename: BUILD ? '[name].[contenthash].css' : '[name].css',
            chunkFilename: BUILD ? '[id].[contenthash].css' : '[id].css'
        })
    ];

    if(!TEST) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: 'client/app.template.html',
                filename: '../client/app.html',
                alwaysWriteToDisk: true
            }),
            new HtmlWebpackHarddiskPlugin()
        );

        config.optimization = {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: 'vendor',
                        chunks: 'initial',
                        test: /[\\/]node_modules[\\/]/,
                        minChunks: 1
                    }
                }
            }
        };
    }

    if(BUILD) {
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            })
        );
    }

    if(DEV) {
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"development"'
                }
            })
        );
    }

    config.cache = DEV;

    /**
     * Dev server configuration
     */
    config.devServer = {
        contentBase: './client/',
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        }
    };

    config.node = {
        global: true,
        process: true,
        crypto: 'empty',
        clearImmediate: false,
        setImmediate: false
    };

    return config;
};
