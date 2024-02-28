import express, { NextFunction, Request, Response } from 'express';

export interface AuthService {
  getAudience(): string;
  getIssuerBaseURL(): string;
  auth(audience: string, issuerBaseURL: string, hashType: string): express.Handler;
  generateAuthMiddleware(req: Request, res: Response, next: NextFunction): express.Handler;
  authorize(req: Request, res: Response, next: NextFunction): void;
}

