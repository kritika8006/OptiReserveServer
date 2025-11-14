import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No Token" });

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid Token" });
  }
};
