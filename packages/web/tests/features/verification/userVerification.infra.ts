import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { CompositionRoot } from '../../../src/shared/compositionRoot/compositionRoot';
import { VerificationPresenter } from '../../../src/modules/verification/presentation/verification.presenter';
import {
  VerificationController,
} from '../../../src/modules/verification/application/verification.controller';
import { VerificationFixture } from '../../fixtures/verification.fixture';
import { MockVerificationService } from '../../../src/modules/verification/infra/mockVerification.service';
import { VerificationData } from '../../../src/modules/verification/domain/verificationData';

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
  path.join(__dirname, '../../../../../packages/shared/tests/features/userVerification.feature'),
  { tagFilter: '@web and not @excluded' },
);


defineFeature(feature, (test) => {
  let compositionRoot: CompositionRoot;
  let verificationController: VerificationController;
  let verificationPresenter: VerificationPresenter;
  let verificationFixture: VerificationFixture;
  let verifiedData: VerificationData;
  let mockVerifyUser: MockVerificationService;
  const url = 'https://test.com/?session_token=1234234&state=state1234';

  beforeEach(async () => {
    compositionRoot = new CompositionRoot('test');
    await compositionRoot.create();

    verificationPresenter = compositionRoot.getVerificationModule().presenter;
    verificationController = compositionRoot.getVerificationModule().controller;
    mockVerifyUser = compositionRoot.getVerificationModule().verificationService as MockVerificationService;
    verifiedData = { success: true, userId: '1234', continueUri: '/verify-user'};

    // Set up the mock verification service to return the test verified data.
    verificationFixture = new VerificationFixture(compositionRoot);
    verificationFixture.setVerificationResponse(verifiedData);
  });

  test('New user is verified', ({ given, when, then }) => {
    given('I am an unverified user', () => {
      expect(verificationPresenter.viewModel.isVerified).toBe(false);
      expect(verificationPresenter.viewModel.continueUri).toBe('');
    });

    when('My user account is verified', async () => {
      await verificationController.execute(url);
      expect(mockVerifyUser.timesCalled('verifyUser')).toBe(1);
      expect(mockVerifyUser.toHaveBeenCalledWith('verifyUser', [url])).toBe(true);
    });

    then('I am redirected to the create member page', () => {
      expect(verificationPresenter.viewModel.isVerified).toBe(true);
      expect(verificationPresenter.viewModel.continueUri).toBe(verifiedData.continueUri);
      expect(verificationPresenter.viewModel.userId).toBe(verifiedData.userId);
    });
  });
})