import { Response, Request, NextFunction } from 'express';


export const handleRequest = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const sendResponse = (res: Response, status: number, data?: unknown) => {
  res.status(status).json(data);
};
