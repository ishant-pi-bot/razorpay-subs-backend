import { Request, Response, NextFunction } from 'express';

export function rawBodyMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.headers['content-type'] !== 'application/json') {
    return next();
  }

  let data = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
}
