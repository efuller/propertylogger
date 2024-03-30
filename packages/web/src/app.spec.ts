import { MockAuthClient } from './modules/auth/AuthClient.ts';

const authClient = new MockAuthClient();
const mockAuthClient = jest.fn().mockResolvedValue(authClient);

jest.mock('@auth0/auth0-spa-js', () => ({
  createAuth0Client: jest.fn().mockResolvedValue(mockAuthClient),
}));

import { CompositionRoot } from './compositionRoot.tsx';

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

      if (!presenter) {
        throw new Error('Presenter not set up');
      }

      await presenter.load();
      expect(presenter.viewModel.isAuthenticated).toBe(false);
    });

    it('should be able to put the app in a logged in state', async () => {
      compositionRoot.setAsLoggedIn();

      const authModule = compositionRoot.getAuthModule();
      const { presenter } = authModule;

      if (!presenter) {
        throw new Error('Presenter not set up');
      }
      await presenter.load();
      expect(presenter.viewModel.isAuthenticated).toBe(true);
    });
  });
});
