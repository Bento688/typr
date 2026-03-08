export const botMiddleware = (req, res, next) => {
  const blockedExtensions = [".php", ".env", ".git", ".sql", ".ini", ".sh"];

  if (blockedExtensions.some((ext) => req.path.endsWith(ext))) {
    return res.status(404).send("Not found");
  }

  next();
};
