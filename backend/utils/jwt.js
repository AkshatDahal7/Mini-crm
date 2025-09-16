const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
  if (err) {
    console.error("❌ JWT verification error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }

  console.log("✅ Decoded user:", decoded);
  req.user = decoded;
  next();
});

}

module.exports = auth;
