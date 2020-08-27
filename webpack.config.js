const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const WorkboxPlugin = require("workbox-webpack-plugin");
const NunjucksWebpackPlugin = require("nunjucks-webpack-plugin");
const extractLoader = require("extract-loader");
const MergePlugin = require("merge-webpack-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const fs = require('fs');

// Store .html file names in src/ in an array
const pages =
  fs
    .readdirSync(path.resolve(__dirname, 'src'))
    .filter(fileName => fileName.endsWith('.twig'));

// const FileManagerPlugin = require('filemanager-webpack-plugin');
// const glob_entries = require('webpack-glob-folder-entries');

//#1: Define the HTML Webpack Plugin:
// const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
//     filename: 'index.html',
//     inject: 'body',

//     // Here is part of the magic, we get the index.njk but we tell
//     // webpack to pass it through the nunjucks-html-loader
//     template: 'nunjucks-html-loader!./src/index.njk'
// });

// Optional, but highly recommended. Create a returnEntries:
// Webpack doesn't support glob paths. For the nunjucks-html-loader
// we need each path to be specified for it to work (YES, even subdirectories!)

// function returnEntries(globPath) {
//     let entries = glob_entries(globPath, true);
//     let folderList = new Array();
//     for (let folder in entries) {
//         folderList.push(path.join(__dirname, entries[folder]));
//     }
//     return folderList;
// }



module.exports = {
    mode: 'development',
    entry: {
        index: './src/js/index.js',
        bookeasy: './src/js/bookeasy.js',
        // checkout: './src/js/checkout.js'
        // index: './src/index.js',
        // 'bookeasy-mods': './src/js/bookeasy-mods.js',
        // 'bookeasy-mods': './src/js/bookeasy-utility.js',
        // details: './src/js/inline/details-gadget.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        publicPath: 'dist/'
        // chunkFilename: '[name].bundle.js'
    },

    resolve: {
		extensions: ['.jsx', '.js', '.json'],
		modules: [
			path.resolve(__dirname, "src/lib"),
			path.resolve(__dirname, "node_modules"),
			'node_modules'
		],
		alias: {
			components: path.resolve(__dirname, "src/components"),    // used for tests
			style: path.resolve(__dirname, "src/style"),
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
    },

    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        compress: true,
         watchContentBase: true,  // watch for changes
         watchOptions: {
             ignored: /node_modules/
         },
         hot: true,
        // writeToDisk: true,
        port: 3080,
        historyApiFallback: true   // sets default page to index.html
        // https: true
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all'
    //     }
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // Compiles Sass to CSS
                        loader: 'sass-loader',
                        options: {
                                includePaths: ['styles/'],
                                sourceMap: true
                            }
                    }
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'images',
                    name: '[name].[ext]'
                }
                // use: [
                  // 'file-loader',
                // ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(njk|nunjucks)$/,
                use: [
                    'raw-loader',
                    {
                        loader:'nunjucks-render-loader',
                        options: {
                            path: path.resolve(__dirname, 'src/templates')
                        }
                    }
                ]
            },
            {
                test: /\.twig$/,
                use: [
                    'raw-loader', //?name=[name].[ext]',
                    // loader: 'raw-loader',
                    // options: {
                        // name=[name].[ext],
                    //}
                    {
                        loader: 'twig-html-loader',
                        options: {
                            data: (context) => {
                                const data = path.join(__dirname, 'src/static/data/operatorData.json');
                                context.addDependency(data); // Force webpack to watch file
                                return context.fs.readJsonSync(data, { throws: false }) || {};
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // clean dist folder but not copied files
        // new CleanWebpackPlugin(
        //     {
        //         cleanOnceBeforeBuildPatterns: ['dist/**/*', '!data/**/*']
        //     }
        // ),
        new ManifestPlugin(),
        // new MergePlugin({
        //     search: './src/templates/_data/**/*.json',
        // }),
        // HtmlWebpackPluginConfig,
        // ...pages.map(page => new HtmlWebpackPlugin({
        //     template: page,
        //     filename: page
        //   })),

        new WriteFilePlugin(),

        // Copy style before images to avoid delays
        new CopyPlugin([
            {
                from: './src/static/parks/parks-main.css',
                to: 'css/'
            },
            {
                from: './src/static/parks/icons/manifest.json',
                to: 'icons/'
            },
            {
                from: './src/static/data/',
                to: 'data/'
            }
        ]),

        new NunjucksWebpackPlugin({
            templates: [
              {
                from: 'index.njk',
                to: 'index.html'
              },
              {
                from: 'booking.njk',
                to: 'booking.html'
              },
              {
                from: 'details-gadget.njk',
                to: 'details-gadget.html'
              },
              {
                from: 'checkout.njk',
                to: 'checkout.html'
              },
              {
                from: 'thankyou.njk',
                to: 'thankyou.html'
              },
              {
                from: 'reverse.njk',
                to: 'reverse.html'
              },
            ],
            configure: {
                path: './src/templates/'
            }
        }),

        // new HtmlWebpackPlugin({
        //     // title: 'Output Management',
        //     template: './src/templates/index.twig',
        //     filename: './index.html'
        //     // inject: 'body'
        // }),
        // new HtmlWebpackPlugin({
        //     template: './src/templates/details-gadget.twig',
        //     filename: './details-gadget.html',
        //     inject: false
        // }),
        // new HtmlWebpackPlugin({
        //     template: './src/templates/booking.twig',
        //     filename: './booking.html',
        //     // inject: 'body'
        //     inject: false
        // }),
        // new HtmlWebpackPlugin({
        //     template: './src/templates/checkout.twig',
        //     filename: './checkout.html',
        //     // inject: 'body'
        //     inject: false
        // }),
        // new HtmlWebpackPlugin({
        //     template: './src/templates/reservoirs.twig',
        //     filename: './reservoirs.html',
        //     inject: false
        // }),
        // new HtmlWebpackPlugin({
        //     template: './src/templates/thankyou.twig',
        //     filename: './thankyou.html',
        //     inject: false
        // }),

        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[id].css'
        }),

        // Copy the images folder and optimize all the images
        new CopyPlugin([
            {
                from: './src/images/',
                to: 'images/'
            }
        ]),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i
        }),

        new MergeIntoSingleFilePlugin({
            files: {
                'serviceworker.js': [
                    './src/js/pwabuilder-sw.js'
                ],
                'manifest.webmanifest': [
                    './src/js/manifest.webmanifest'
                ],
                'js/bookeasy-mods-bund.js': [
                  './src/js/bookeasy-utility.js',
                  './src/js/bookeasy-mods.js',
                  './src/js/booking-statewide.js',
                  './src/js/inline/details-gadget.js',
                  './src/js/inline/cart-gadget.js',
                  './src/js/inline/autocomplete.js'
                ],
                'preact.js': [
                    './node_modules/preact/dist/preact.js'  //'https://cdnjs.cloudflare.com/ajax/libs/preact/8.5.2/preact.dev.js'
                ]
                // 'bookeasy.css': [
                //     './src/styles/bookeasy.css'
                // ]
            }
        }),
        new WorkboxPlugin.InjectManifest({
            swSrc: "./src/js/sw.js",
            swDest: "sw.js"
        }),
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true,
        })

        // new ImageminPlugin({
        //     // disable: process.env.NODE_ENV !== 'production', // Disable during development
        //     pngquant: {
        //         quality: '95-100'
        //     }
        // }),
        // new StyleLintPlugin({
            //     configFile: './stylelint.config.js',
        //     files: './src/styles/*.scss',
        //     syntax: 'scss'
        // })
        // new WebpackMd5Hash(),
        // new FileManagerPlugin({
        //     onEnd: {
            //         move: [
        //             // {source: 'dist/**/*.html', destination: './dist/html/*.html'},
        //             // {source: 'dist/*.{css,scss}', destination: '/css/'},
        //             // {source: 'dist/*.js', destination: 'dist/js/'},
        //             {source: 'dist/*.{jpg,png,gif,svg}', destination: '/images/'},
        //             {source: 'dist/*.{woff,woff2}', destination: '/fonts/'}
        //         ]
        //     }
        // })
    ]
};