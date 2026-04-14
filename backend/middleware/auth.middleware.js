/*
-Read token from request
-Check if token exists
-Verify token
-Extract user info
-Allow request OR block


req -> incoming request
res -> response
next -> pass control
*/

import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey"); // Use env variable in production
    req.user = decoded;
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
