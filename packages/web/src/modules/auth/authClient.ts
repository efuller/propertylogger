export interface AuthClient {
  login(): Promise<void>;
  logout(): Promise<void>;
  handleRedirectCallback(): Promise<void>;
  getToken(): Promise<string>;
  isAuthenticated(): Promise<boolean>;
  checkSession(): Promise<void>;
}
