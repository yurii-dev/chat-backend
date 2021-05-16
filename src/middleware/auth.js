const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  if (
    req.path === "/users/signin" ||
    req.path === "/users/signup" ||
    req.path === "/users/verify"
  ) {
    return next();
  }
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = auth;
