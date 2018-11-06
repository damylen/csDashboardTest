module.exports = {
  lintOnSave: true,
  baseUrl: '',
  configureWebpack: {    
    resolve: {
      symlinks: false,
      alias: {
        '@': 'src/'
      }
    },    
    module: {
      rules: [
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: ['/public/index.html']
        }
      ]
    }
  }
};
