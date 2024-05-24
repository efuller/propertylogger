import * as jose from 'jose';
import { VerificationService } from '../application/verificationService.ts';
import { Auth0VerificationService } from './auth0Verification.service.ts';

const mockSignJWT = jest.fn(() => 'signed-jwt');
const mockSetSubject = jest.fn().mockReturnThis();

// This should have a type associated with it.
const payLoadStub = {
  payload: {
    data: {
      user: {
        user_id: '12323'
      }
    },
    continue_uri: 'https://example.com',
  }
};

jest.mock('jose', () => ({
  jwtVerify: jest.fn(() => (payLoadStub)),
  SignJWT: jest.fn().mockImplementation(() => ({
    setIssuedAt: mockSetSubject,
    setSubject: jest.fn().mockReturnThis(),
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuer: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: mockSignJWT,
  })),
}));

describe('Auth0Verification', () => {
  let textEncoderSpy: jest.SpyInstance;
  let auth0Verification: VerificationService;
  const encode = jest.fn().mockReturnValue(new Uint8Array());
  const url = 'https://huntscribe.app/?session_token=token_1234&state=state_1234';

  beforeEach(() => {
    textEncoderSpy = jest.spyOn(global, 'TextEncoder');
    auth0Verification = new Auth0VerificationService();
  });

  it('should call jose.jwtVerify with token and secret', async () => {
    textEncoderSpy.mockImplementation(() => ({ encode } as Pick<TextEncoder, 'encode'>));
    const result = await auth0Verification.verifyUser(url);

    expect(jose.jwtVerify).toHaveBeenCalledTimes(1);
    expect(jose.jwtVerify).toHaveBeenCalledWith('token_1234', expect.any(Uint8Array));

    expect(jose.SignJWT).toHaveBeenCalledTimes(1);
    expect(jose.SignJWT).toHaveBeenCalledWith(
      expect.objectContaining({ state: expect.any(String) })
    );

    expect(result).toEqual({
      userId: '12323',
      continueUri: `${payLoadStub.payload.continue_uri}?state=state_1234&session_token=signed-jwt`,
      success: true,
    });
  });
});