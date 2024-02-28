import { Middleware } from '@efuller/api/src/shared/http/middleware/middleware';
import express, { NextFunction, Request, Response } from 'express';
import { AuthService } from '@efuller/api/src/modules/auth/authService';

export class AuthMiddleware implements Middleware {
  constructor(private readonly authService: AuthService) {}
  handle(): express.Handler {
    return (req: Request, res: Response, next: NextFunction) => {
      this.authService.authorize(req, res, next);
    }
  }
}

