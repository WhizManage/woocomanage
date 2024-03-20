const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaults,
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  resolve: {
    ...defaults.resolve, // שמירה על הגדרות הקיימות
    alias: {
      ...defaults.resolve.alias, // שמירה על כינויים קיימים אם ישנם
      '@components': path.resolve(__dirname, 'src/components/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@': path.resolve(__dirname, 'src/')
    },
    fallback: {
      "stream": require.resolve('stream-browserify'),
      "buffer": require.resolve("buffer/")
    },
  },
};

