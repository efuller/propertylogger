import { NextFunction, Request, Response } from 'express';

export interface AuthService {
  getAudience(): string;
  getIssuerBaseURL(): string;
  authorize(req: Request, res: Response, next: NextFunction): void;
}
