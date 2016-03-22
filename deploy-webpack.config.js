var path = require("path");

module.exports = {
    entry: [
        "./src/a11y-dialog.js"
    ],
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: "a11y-dialog.js",
        library: 'A11yDialog',
        libraryTarget: 'umd'
    },
    module: {
      loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }
      ]
    }
};