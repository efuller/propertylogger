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

  authorize(req: Request, res: Response, next: NextFunction) {
    const checkJwt = this.auth(this.getAudience(), this.getIssuerBaseURL(), 'RS256');
    checkJwt(req, res, next);
  }

  private auth(audience: string, issuerBaseURL: string, hashType: string): express.Handler {
    // Returns and Express Middleware Handler
    const jwtCheck = auth({
      audience,
      issuerBaseURL,
      tokenSigningAlg: hashType
    });

    return jwtCheck;
  }
}
