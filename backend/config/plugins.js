module.exports = ({ env }) => ({
  upload: {
    config: {
      sizeLimit: env.int("UPLOAD_SIZE_LIMIT", 50 * 1024 * 1024),
    },
  },
});
