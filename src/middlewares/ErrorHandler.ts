import { NextFunction, Request, Response } from 'express';

export function errorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.code && err.message) {
    res.status(err.code).json({ 
      statusCode: err.code,
      error: err.message
     });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
