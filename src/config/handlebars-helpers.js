const path = require("path");

module.exports = (isProduction) => {
  return {
    assetPath: (relativePath) => {
      if (isProduction) {
        return `/static/${relativePath}`;
      } else {
        return `/static/${relativePath}`;
      }
    },
  };
};
