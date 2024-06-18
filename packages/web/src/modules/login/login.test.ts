import { CompositionRoot } from '../../shared/compositionRoot/compositionRoot.tsx';
import { LoginPresenter } from './login.presenter.ts';
import { LoginController } from './login.controller.ts';
import { AuthPresenter } from '../auth/auth.presenter.ts';

describe('Login', () => {
  let compositionRoot: CompositionRoot;
  let loginPresenter: LoginPresenter;
  let loginController: LoginController;
  let authPresenter: AuthPresenter;

  beforeEach(async () => {
    compositionRoot = new CompositionRoot('test');
    await compositionRoot.create();
    loginPresenter = compositionRoot.getLoginModule().presenter;
    authPresenter = compositionRoot.getAuthModule().presenter;
    loginController = compositionRoot.getLoginModule().controller;
  });

  it('should redirect to the homepage if the user is not logged in', async () => {
    // Arrange
    compositionRoot.setAsLoggedIn(false);
    // Act
    await loginController.check();
    // Assert
    expect(loginPresenter.viewModel.redirectTo).toBe('/');
  });

  it('should create member and redirect to dashboard if user is authenticated and not a member', async () => {
    // Arrange
    compositionRoot.setAsLoggedIn(true);
    // Act
    await loginController.check();
    // Assert
    expect(loginPresenter.viewModel.redirectTo).toBe('/app/dashboard');
  });

  it.todo('should redirect to dashboard of user is already a member');
});
