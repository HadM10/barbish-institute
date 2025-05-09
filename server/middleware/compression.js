const compression = require("compression");

const compressionMiddleware = compression({
  level: 6, // Compression level (0-9), 6 is default
  threshold: 100 * 1024, // Only compress responses larger than 100kb
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    // Use compression for all text-based responses
    return compression.filter(req, res);
  },
});

module.exports = compressionMiddleware;
