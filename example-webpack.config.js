var path = require("path");

module.exports = {
    entry: [
        "./example/main.js"
    ],
    output: {
        path: path.resolve(__dirname, "example"),
        filename: "index.js",
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