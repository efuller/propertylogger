import { NextFunction, Request, Response } from 'express';

export interface AuthService {
  authorize(req: Request, res: Response, next: NextFunction): void;
}
