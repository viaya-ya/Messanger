const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@app': path.resolve('src/UI/app/'),
      '@constants': path.resolve('src/UI/constants/'),
      '@Custom': path.resolve('src/UI/Custom/'),
      '@image': path.resolve('src/UI/image/'),
      '@sprite': path.resolve('src/UI/sprite/'),
    },
  },
};
