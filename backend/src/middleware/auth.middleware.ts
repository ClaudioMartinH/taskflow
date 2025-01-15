import { NextFunction, Request, Response } from "express";
import process from 'process'
import jwt from "jsonwebtoken";
import { STATUS } from "../utils/states/Status.js";


interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload;
}
const authMiddlewareJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.warn("Token missing in headers");
   res
      .status(STATUS.UNAUTHORIZED)
      .json({ error: "Token not provided" });
    return;
  }

  const secret = process.env.JWT_SECRET as string;
  if (!secret) {
    console.error("JWT secret not defined");
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: "Server configuration error" });
    return;
  }
    

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (err) {
    res.status(STATUS.UNAUTHORIZED).json({ error: "Invalid token", err });
    return;
  }
};

export default authMiddlewareJWT;
