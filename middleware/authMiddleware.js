const jwt = require("jsonwebtoken");

const authMiddleware = function (req, res, next) {
  try {
    // Extract token from Authorization header
    // console.log(req.headers)
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Check if header follows "Bearer token" format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid token format. Use: Bearer <token>",
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      // email: decoded.email
    };

    // continue to next middleware/route handler
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired.",
      });
    }

    return res.status(500).json({
      message: "Server error during authentication.",
    });
  }
};

module.exports = authMiddleware;
