import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { CompositionRoot } from '../../src/shared/compositionRoot/compositionRoot';
import { VerificationPresenter } from '../../src/modules/verification/presentation/verification.presenter';
import { VerificationController } from '../../src/modules/verification/application/verification.controller';
import { VerificationFixture } from '../fixtures/verification.fixture';

const mockAuthClient = jest.fn(() => ({
  loginWithRedirect: jest.fn(),
  handleRedirectCallback: jest.fn(),
  isAuthenticated: jest.fn(),
  getTokenSilently: jest.fn(),
  logout: jest.fn(),
  checkSession: jest.fn(),
}));

jest.mock('@auth0/auth0-spa-js', () => ({
  createAuth0Client: jest.fn(() => ({
    ...mockAuthClient()
  })),
}));

const feature = loadFeature(
  path.join(__dirname, '../../../../packages/shared/tests/auth/userVerification.feature'),
  { tagFilter: '@web and not @excluded' },
);

jest.mock('jose', () => ({
  TextEncoder: jest.fn(),
}));

defineFeature(feature, (test) => {
  let compositionRoot: CompositionRoot;
  let verificationController: VerificationController;
  let verificationPresenter: VerificationPresenter;
  let verificationFixture: VerificationFixture;
  let user = null
  let url = '';
  let expected;

  beforeEach(async () => {
    compositionRoot = new CompositionRoot('test');
    await compositionRoot.create();
    verificationPresenter = compositionRoot.getVerificationModule().presenter;
    verificationController = compositionRoot.getVerificationModule().controller;
    expected = { userId: '123', continueUri: '/verify-user'};
    verificationFixture = new VerificationFixture(compositionRoot);
    verificationFixture.setVerificationResponse(expected);
  });

  test('New user is verified and becomes member', ({ given, and, when, then }) => {
    given('I am a new user', () => {
      user = { email: 'test@test.com' };
    });

    and('I have not been verified', () => {
      expect(verificationPresenter.viewModel.isVerified).toBe(false);
      expect(verificationPresenter.viewModel.continueUri).toBe('');
    });

    when('My user account is verified', async () => {
      await verificationController.execute(url);
    });

    then('I am redirected to the create member page', () => {
      expect(verificationPresenter.viewModel.isVerified).toBe(true);
      expect(verificationPresenter.viewModel.continueUri).not.toBeNull();
      expect(verificationPresenter.viewModel.continueUri).toBe(expected!.continueUri);
    });
  });
})