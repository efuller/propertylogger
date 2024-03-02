import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '@efuller/api/src/modules/auth/infra/middleware/authMiddleware';
import { Auth0AuthService } from '@efuller/api/src/modules/auth/adapters/auth0AuthService';
import { MockAuth0AuthService } from '@efuller/api/src/modules/auth/adapters/auth0AuthServiceSpy';

describe('authMiddleware', () => {
  it('should call the auth middleware', () => {
    // Arrange
    const authService = new Auth0AuthService();
    const authMiddleware = new AuthMiddleware(authService);
    const req = {} as Request;
    const res = {} as Response;
    const next = {} as NextFunction;
    const jwtCheck = jest.fn();
    const generateMiddlewareSpy = jest
      .spyOn(authService, 'generateAuthMiddleware')
      .mockReturnValue(jwtCheck);

    // Act
    authMiddleware.handle()(req, res, next);

    // Assert
    expect(generateMiddlewareSpy).toBeCalledTimes(1);
    expect(jwtCheck).toBeCalledTimes(1);
    expect(jwtCheck).toBeCalledWith(req, res, next);
  });

  it('should call the auth middleware using a manual spy', () => {
    const authServiceSpy = new MockAuth0AuthService();
    const authMiddleware = new AuthMiddleware(authServiceSpy);
    const req = {} as Request;
    const res = {} as Response;
    const next: NextFunction = () => null;

    // Act
    authMiddleware.handle()(req, res, next);

    // Assert
    expect(authServiceSpy.timesCalled('auth')).toBe(1)
    expect(authServiceSpy.toHaveBeenCalledBy('checkJwt', 'auth')).toBe(true);
  });
});