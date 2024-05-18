import { useEffect } from 'react';
import * as jose from 'jose';
import { CustomJWTPayload } from '../shared/router';
import { useNavigate } from 'react-router-dom';

export const CreatingAccountPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('session_token');
      const state = url.searchParams.get('state');

      if (!token) {
        navigate('/');
      }

      const secret = new TextEncoder().encode(process.env.APP_SECRET_KEY);
      const decoded: jose.JWTVerifyResult<CustomJWTPayload> = await jose.jwtVerify(token, secret);

      const created = { state, memberCreate: true };
      const alg = 'HS256'
      const jwt = await new jose.SignJWT(created)
        .setIssuedAt()
        .setSubject(decoded.payload.data.user.user_id)
        .setProtectedHeader({ alg, typ: 'JWT' })
        .setIssuer(process.env.AUTH0_DOMAIN)
        .setExpirationTime('2h')
        .sign(secret);

      const continueUri = `${decoded.payload.continue_uri}?state=${state}&session_token=${jwt}`;

      window.location.href = continueUri;
    }
    verify();
  }, [navigate]);

  return (
    <div>
      <h1>Creating Account...</h1>
    </div>
  );
}