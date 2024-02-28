import { AuthService } from '@efuller/api/src/modules/auth/authService';
import express, { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

export class Auth0AuthService implements AuthService {
  getAudience() {
    return process.env.AUTH0_AUDIENCE || '';
  }

  getIssuerBaseURL() {
    return process.env.AUTH0_ISSUER_BASE_URL || '';
  }

  generateAuthMiddleware() {
    const audience = this.getAudience();
    const issuerBaseURL = this.getIssuerBaseURL();

    if (!audience || !issuerBaseURL) {
      throw new Error('Missing environment variables for Auth0');
    }

    return this.auth(audience, issuerBaseURL, 'RS256')
  }

  authorize(req: Request, res: Response, next: NextFunction) {
    const middleware = this.generateAuthMiddleware();
    middleware(req, res, next);
  }

  auth(audience: string, issuerBaseURL: string, hashType: string): express.Handler {
    // Returns and Express Middleware Handler
    const jwtCheck = auth({
      audience,
      issuerBaseURL,
      tokenSigningAlg: hashType
    });

    return jwtCheck;
  }
}
