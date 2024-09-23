const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  message: "Limit reached, please try again in 15 min",
});

module.exports = limiter;
