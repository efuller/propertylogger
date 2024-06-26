const mockAuthClient = jest.fn(() => ({
  loginWithRedirect: jest.fn(),
  handleRedirectCallback: jest.fn(),
  isAuthenticated: jest.fn(),
  getTokenSilently: jest.fn(),
  logout: jest.fn(),
  checkSession: jest.fn(),
}));

jest.mock('@auth0/auth0-spa-js', () => ({
  createAuth0Client: jest.fn().mockResolvedValue(mockAuthClient),
}));

jest.mock('jose', () => ({
  TextEncoder: jest.fn(),
}));

import { CompositionRoot } from './shared/compositionRoot/compositionRoot.tsx';

describe('App', () => {
  let compositionRoot: CompositionRoot;

  beforeEach(async () => {
    compositionRoot = new CompositionRoot();
    await compositionRoot.create();
  });

  describe('Auth', () => {
    it('should not be logged in at the start', async () => {
      const authModule = compositionRoot.getAuthModule();
      const { presenter } = authModule;

      expect(presenter.viewModel.isAuthenticated).toBe(false);
    });

    it('should be able to put the app in a logged in state', async () => {
      compositionRoot.setAsLoggedIn();

      const authModule = compositionRoot.getAuthModule();
      const { presenter } = authModule;

      expect(presenter.viewModel.isAuthenticated).toBe(true);
    });
  });
});
