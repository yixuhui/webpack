const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  arser: 'sugarss',
  plugins: {
    'autoprefixer': !isDev
  }
}