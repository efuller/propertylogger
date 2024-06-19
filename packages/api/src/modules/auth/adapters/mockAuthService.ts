import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@efuller/api/src/modules/auth/application/auth.service';

export class MockAuthService implements AuthService {
  authorize(req: Request, res: Response, next: NextFunction) {
    next();
  }
}