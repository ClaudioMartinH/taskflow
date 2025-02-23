import { NextFunction, Request, Response } from "express";
import process from 'process'
import jwt from "jsonwebtoken";
import { STATUS } from "../utils/states/Status.js";
import { handleRequest, sendResponse } from "../utils/handlers/http.js";


interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload;
}
const authMiddlewareJWT = handleRequest(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.warn('Token missing in headers');
      sendResponse(res, STATUS.UNAUTHORIZED, 'Token not provided');
      return;
    }

    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      console.error('JWT secret not defined');
      sendResponse(
        res,
        STATUS.INTERNAL_SERVER_ERROR,
        'Server configuration error',
      );
      return;
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    (req as AuthenticatedRequest).user = decoded;
    next();
  },
);


export default authMiddlewareJWT;
