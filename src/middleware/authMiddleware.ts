import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const payload = verifyToken(token);
      (req as any).user = payload;
      next();
    } catch (error) {
      res.status(403).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Authorization missing" });
  }
};
