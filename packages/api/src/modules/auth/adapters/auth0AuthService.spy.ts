import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../application/auth.service';
import { Call } from '@efuller/api/tests/shared/spy';

export class MockAuth0AuthService implements AuthService {
  calls: Record<string, Call[]> = {};

  getAudience() {
    return process.env.AUTH0_AUDIENCE || '';
  }

  getIssuerBaseURL() {
    return process.env.AUTH0_ISSUER_BASE_URL || '';
  }

  getHashType() {
    return 'RS256';
  }

  auth(audience: string, issuerBaseURL: string, hashType: string) {
    this.addCall('auth', {params: [audience, issuerBaseURL, hashType]});

    return (req: Request, res: Response, next: NextFunction) => {
      this.addCall(
        'checkJwt',
        {
          params: [req, res, next],
          calledBy: 'auth'
        }
      );

      if (!req.headers.authorization) {
        res.status(401).send('Unauthorized');
        return;
      }

      return true;
    }
  }

  authorize(req: Request, res: Response, next: NextFunction) {
    const middleware = this.auth(this.getAudience(), this.getIssuerBaseURL(), this.getHashType());
    this.addCall('authorize', {params: [req, res, next]});
    middleware(req, res, next);
  }

  addCall(methodName: string, data: Call) {
    if (!this.calls[methodName]) {
      this.calls[methodName] = [{ ...data }];
      return;
    }
    this.calls[methodName].push({ ...data });
  }

  timesCalled(methodName: string) {
    if (!this.calls[methodName]) {
      return 0;
    }
    return this.calls[methodName].length;
  }

  toHaveBeenCalledBy(methodName: string, calledBy: string) {
    if (!this.calls[methodName]) {
      return false;
    }
    return this.calls[methodName].some((call) => call.calledBy === calledBy);
  }
}
