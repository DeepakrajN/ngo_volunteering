module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  devServer: (devServerConfig) => {
    devServerConfig.allowedHosts = 'all';  // ✅ correct syntax
    devServerConfig.port = 5000;
    return devServerConfig;
  },
};
