const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

module.exports = {
  entry: [
      './src/index.js'
  ],
  module: {
      rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /\.css$/,
            use: [
                {
              	    loader: "style-loader"
                }, 
                {
              	    loader: "css-loader",
                }
            ]
        }
      ]
  },
  resolve: {
      extensions: ['*', '.js', '.jsx']
  },
  output: {
  	  path: __dirname + '/dist',
  	  publicPath: '/',
  	  filename: 'bundle.js'
  },
  plugins: [htmlPlugin]
};
