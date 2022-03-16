const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const WebpackBar = require("webpackbar");


module.exports = {
    mode: "production",
    // Different modules de l'application
    entry: {
        angular: [
            "angular/angular.min.js",
            "angular-route/angular-route.min.js"
        ],
        materialize: [
            "@materializecss/materialize/dist/js/materialize.min.js",
            "@materializecss/materialize/dist/css/materialize.css",
            "./css/style.css"
        ],
        app: [
            "./js/app.js",
            "./js/controllers/controller.js",
        ]
    },
    // Format de sortie et nettoyage du dossier dist à chaque compilation
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        clean: true
    },
    module: {
        rules: [
            // Gestion du javascript et transpilation
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', {targets: "defaults, not IE 11"}]]
                    }
                }
            },
            // Gestion du css
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    // Gestion des fichiers html pour la minification
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "serve.html",
            favicon: "favicon.ico",
            minify: true
        }),
        new HtmlWebpackPlugin({
            filename: "partials/meteovilles.html",
            template: "partials/meteovilles.html",
            minify: true,
            inject: false
        }),
        new HtmlWebpackPlugin({
            filename: "partials/previsions.html",
            template: "partials/previsions.html",
            minify: true,
            inject: false
        }),
        new HtmlWebpackPlugin({
            filename: "partials/villes.html",
            template: "partials/villes.html",
            minify: {
                collapseWhitespace: true,
                keepClosingSlash: true,
                removeComments: true,
                removeRedundantAttributes: false,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
            inject: false
        }),
        new WebpackBar()
    ],
    // Minification du css et du js
    optimization: {
        minimize: true,
        minimizer: [
            `...`,
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default",
                        {discardComments: {removeAll: true}}
                    ]
                }
            })
        ],
        nodeEnv: "production",
    },
    performance: {
        maxEntrypointSize: 400000,
    }
};
