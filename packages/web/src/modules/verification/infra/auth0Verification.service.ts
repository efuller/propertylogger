import * as jose from 'jose';

import { VerificationService } from '../application/verificationService.ts';
import { CustomJWTPayload } from '../../../shared/router';
import { VerificationData } from '../domain/verificationData.ts';
import { UrlUtil } from '@efuller/shared/src/utils/UrlUtil.ts';

export class Auth0VerificationService implements VerificationService {
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

  async verifyUser(url: string): Promise<VerificationData> {
    const state = UrlUtil.getSearchParam(url, 'state');
    const secret = this.getSecret();
    const token = UrlUtil.getSearchParam(url, 'session_token');
    const decoded: jose.JWTVerifyResult<CustomJWTPayload> = await jose.jwtVerify(token, secret);
    const jwt = await this.createSignedJwt(decoded, state);

    const continueUri = `${decoded.payload.continue_uri}?state=${state}&session_token=${jwt}`;

    return {
      userId: decoded.payload.data.user.user_id,
      continueUri,
      success: true,
    }
  }
}