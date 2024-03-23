import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '@efuller/api/src/modules/auth/infra/middleware/authMiddleware';
import { MockAuth0AuthService } from '@efuller/api/src/modules/auth/adapters/auth0AuthService.spy';

describe('authMiddleware', () => {
  it('should call the auth middleware using a manual spy', () => {
    const authServiceSpy = new MockAuth0AuthService();
    const authMiddleware = new AuthMiddleware(authServiceSpy);
    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    } as Request;
    const res = {} as Response;
    const next: NextFunction = () => null;

    // Act
    const result = authMiddleware.handle();
    result(req, res, next);

    // Assert
    expect(authServiceSpy.timesCalled('auth')).toBe(1)
    expect(authServiceSpy.timesCalled('checkJwt')).toBe(1)
  });
});