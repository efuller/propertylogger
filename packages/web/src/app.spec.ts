import { CompositionRoot } from './compositionRoot.tsx';

describe('App', () => {
  let compositionRoot: CompositionRoot;

  describe('Auth', () => {
    it('Can login', async () => {
      compositionRoot = new CompositionRoot();

      const authModule = compositionRoot.getAuthModule();
      const presenter = authModule.getPresenter();
      const controller = authModule.getController();

      await presenter.load();
      expect(presenter.viewModel.isAuthenticated).toBe(false);

      await controller.login();
      expect(presenter.viewModel.isAuthenticated).toBe(true);
    });
  });
});
