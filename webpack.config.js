const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {
  pages,
  initialPage,
  languages,
  defaultLanguage,
} = require("./src/config/constants");
const createHandlebarsHelpers = require("./src/config/handlebars-helpers");

const isProduction = process.env.NODE_ENV === "production";
const handlebarsHelpers = createHandlebarsHelpers(isProduction);

const loadLocale = (locale, page) => {
  const filePath = path.resolve(
    __dirname,
    "src",
    "pages",
    page,
    "locale",
    `${locale}.json`
  );
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } else {
    throw new Error(`Locale file not found: ${filePath}`);
  }
};

const generateEntries = (pages) => {
  const pagesDir = path.resolve(__dirname, "src", "pages");
  const entries = {};

  pages.forEach((page) => {
    const entryPath = path.join(pagesDir, page, "index.js");
    if (fs.existsSync(entryPath)) {
      entries[page] = entryPath;
    } else {
      throw new Error(`Entry file not found: ${entryPath}`);
    }
  });

  return entries;
};

const generateHtmlPlugins = (
  pages,
  initialPage,
  languages,
  defaultLanguage
) => {
  const pagesDir = path.resolve(__dirname, "src", "pages");
  const plugins = [];

  const createPlugin = (page, lang, outputPath) => {
    const templatePath = path.resolve(pagesDir, page, "index.hbs");
    if (!fs.existsSync(templatePath))
      throw new Error(`Template file not found: ${templatePath}`);

    return new HtmlWebpackPlugin({
      template: templatePath,
      filename: outputPath,
      chunks: [page],
      templateParameters: {
        ...loadLocale(lang, page),
        assetPath: handlebarsHelpers.assetPath,
      },
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    });
  };

  languages.forEach((lang) => {
    const isDefaultLang = lang === defaultLanguage;
    if (isDefaultLang) {
      plugins.push(createPlugin(initialPage, lang, "index.html"));
      plugins.push(
        createPlugin(initialPage, lang, `${defaultLanguage}/index.html`)
      );
    } else {
      plugins.push(createPlugin(initialPage, lang, `${lang}/index.html`));
    }
  });

  pages.forEach((page) => {
    if (page !== initialPage) {
      languages.forEach((lang) => {
        const isDefaultLang = lang === defaultLanguage;
        if (isDefaultLang) {
          plugins.push(createPlugin(page, lang, `${page}/index.html`));
          plugins.push(
            createPlugin(page, lang, `${defaultLanguage}/${page}/index.html`)
          );
        } else {
          plugins.push(createPlugin(page, lang, `${lang}/${page}/index.html`));
        }
      });
    }
  });

  return plugins;
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: argv.mode || "development",
    entry: generateEntries(pages),
    output: {
      filename: "static/js/[name].[contenthash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      publicPath: isProduction ? "/static/" : "/",
    },
    resolve: {
      alias: {
        "@static": path.resolve(__dirname, "public/static"),
      },
    },
    module: {
      rules: [
        {
          test: /\.hbs$/,
          loader: "handlebars-loader",
          options: {
            precompileOptions: {
              knownHelpersOnly: false,
            },
            helperDirs: path.join(__dirname, "src/config/handlebars-helpers"),
          },
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            filename: "static/img/[name].[contenthash][ext]",
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      ...generateHtmlPlugins(pages, initialPage, languages, defaultLanguage),
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash].css",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public"),
            to: path.resolve(__dirname, "dist"),
          },
        ],
      }),
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      hot: true,
      open: true,
      watchFiles: ["src/**/*", "public/**/*"],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserWebpackPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
      runtimeChunk: "single",
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
  };
};
