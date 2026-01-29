import rateLimit from "express-rate-limit";

// Rate limiting config
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 200,
  message: "Too many requests!, please try again later!",
});

export default limiter;
