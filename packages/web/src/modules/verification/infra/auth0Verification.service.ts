import * as jose from 'jose';

import { VerificationService } from '../application/verificationService.ts';
import { CustomJWTPayload } from '../../../shared/router';

export class Auth0VerificationService implements VerificationService {
  private getToken(url: string) {
    const searchParamsUrl = new URL(url);
    const token: string = searchParamsUrl.searchParams.get('session_token') ?? '';
    return token;
  }

  private getState(url: string) {
    const searchParamsUrl = new URLSearchParams(url);
    const state: string = searchParamsUrl.get('state') ?? '';
    return state;
  }

  private getSecret() {
    return new TextEncoder().encode(process.env.APP_SECRET_KEY);
  }

  private async createSignedJwt(decoded: jose.JWTVerifyResult<CustomJWTPayload>, state: string) {
    const created = { state, memberCreate: true };
    const domain = process.env.AUTH0_DOMAIN || '';

    const alg = 'HS256'
    const jwt = await new jose.SignJWT(created)
      .setIssuedAt()
      .setSubject(decoded.payload.data.user.user_id)
      .setProtectedHeader({ alg, typ: 'JWT' })
      .setIssuer(domain)
      .setExpirationTime('2h')
      .sign(this.getSecret());

    return jwt;
  }

  async verifyUser(url: string): Promise<{ userId: string | null, continueUri: string }> {
    const state = this.getState(url);
    const secret = this.getSecret();
    const token = this.getToken(url);
    const decoded: jose.JWTVerifyResult<CustomJWTPayload> = await jose.jwtVerify(token, secret);
    const jwt = await this.createSignedJwt(decoded, state);

    const continueUri = `${decoded.payload.continue_uri}?state=${state}&session_token=${jwt}`;

    return {
      userId: decoded.payload.data.user.user_id,
      continueUri,
    }
  }
}