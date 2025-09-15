const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = decoded; // decoded payload (id, email, etc.)
    next();
  });
}

module.exports = auth;
