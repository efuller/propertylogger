import { AuthService } from '@efuller/api/src/modules/auth/authService';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';

export class ClerkAuthService implements AuthService {
    getAudience(): string {
        throw new Error('Method not implemented.');
    }
    getIssuerBaseURL(): string {
        throw new Error('Method not implemented.');
    }
    authorize(req: Request, res: Response, next: NextFunction): void {
        const middleware = ClerkExpressRequireAuth();
        middleware(req, res, next);
    }
}
