import { CompositionRoot } from './compositionRoot.tsx';

describe('App', () => {
  let compositionRoot: CompositionRoot;

  beforeEach(() => {
    compositionRoot = new CompositionRoot();
  });

  describe('Auth', () => {
    it('should not be logged in at the start', async () => {
      const authModule = compositionRoot.getAuthModule();
      const { presenter } = authModule;

      await presenter.load();
      expect(presenter.viewModel.isAuthenticated).toBe(false);
    });

    it('should be able to put the app in a logged in state', async () => {
      compositionRoot.setAsLoggedIn();

      const authModule = compositionRoot.getAuthModule();
      const { presenter } = authModule;

      await presenter.load();
      expect(presenter.viewModel.isAuthenticated).toBe(true);
    });
  });
});
