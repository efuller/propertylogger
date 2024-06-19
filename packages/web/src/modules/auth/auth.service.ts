import { AuthClient } from './authClient.ts';

export class AuthService {
  constructor(
    public readonly authClient: AuthClient,
  ){}
}