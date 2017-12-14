const path = require('path');
const webpack = require('webpack');

const resolve = partial => path.resolve(process.cwd(), partial);

module.exports = {
    entry: './src/index',
    output: {
        path: resolve('dist'),
        filename: 'index.js',
        library: '$_LIBRARY_NAME_$',
        libraryTarget: 'umd',
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
            },
        }],
    },

    plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
    devtool: 'source-map',
};
