import { CompositionRoot } from '../../shared/compositionRoot/compositionRoot.tsx';
import { LoginPresenter } from './login.presenter.ts';
import { LoginController } from './login.controller.ts';
import { MockAuthClientAdapter } from '../auth/adapters/mockAuthClientAdapter.ts';
import { MockApiClient } from '../../shared/apiClient/mockApiClient.ts';
import { MemberPresenter } from '../member/member.presenter.ts';

describe('Login', () => {
  let compositionRoot: CompositionRoot;
  let loginPresenter: LoginPresenter;
  let loginController: LoginController;
  let authClient: MockAuthClientAdapter;
  let memberPresenter: MemberPresenter;

  beforeEach(async () => {
    compositionRoot = new CompositionRoot('test');
    await compositionRoot.create();
    loginPresenter = compositionRoot.getLoginModule().presenter;
    loginController = compositionRoot.getLoginModule().controller;
    authClient = compositionRoot.getAuthClient() as MockAuthClientAdapter;
    memberPresenter = compositionRoot.getMemberModule().presenter;
  });

  it('should redirect to the homepage if the user is not logged in', async () => {
    // Arrange
    authClient.setIsAuthenticated(false);
    // Act
    await loginController.check();
    // Assert
    expect(loginPresenter.viewModel.redirectTo).toBe('/');
  });

  it('should create member and redirect to dashboard if user is authenticated and not a member', async () => {
    // Arrange
    authClient.setIsAuthenticated(true);
    authClient.setUser({ email: 'admin@test.com'});
    const apiClient = compositionRoot.getApiClient() as MockApiClient;
    apiClient.setGetResponse({
      success: true,
      error: false,
      data: null,
    });
    apiClient.setPostResponse({
      success: true,
      error: false,
      data: {email: 'admin@test.com'},
    });

    // Act
    await loginController.check();

    // Assert
    expect(memberPresenter.viewModel.member).toEqual({ email: 'admin@test.com'});
    expect(loginPresenter.viewModel.redirectTo).toBe('/app/dashboard');
  });

  it('should redirect to dashboard of user is already a member', async () => {
    // Arrange
    authClient.setIsAuthenticated(true);
    authClient.setUser({ email: 'admin@test.com'});
    const apiClient = compositionRoot.getApiClient() as MockApiClient;
    apiClient.setGetResponse({
      success: true,
      error: false,
      data: {email: 'admin@test.com'},
    });

    // Act
    await loginController.check();

    // Assert
    expect(memberPresenter.viewModel.member).toEqual({ email: 'admin@test.com'});
  });
});
