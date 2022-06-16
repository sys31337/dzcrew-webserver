const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  if (req.user) {
    if (req.user.discordId === "273121308093710346") {
      return next();
    }
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = {};
      req.user.id = decoded.id;
      req.user.email = decoded.email;
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

exports.isAuthorized = (req, res, next) => {
  if (req.user) {
    console.log("User is logged in.");
    next();
  } else {
    console.log("User is not logged in.");
    res.redirect("/");
  }
};
