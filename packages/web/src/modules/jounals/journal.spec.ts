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

import { CompositionRoot } from '../../compositionRoot.tsx';

describe('Journal', () => {
  let compositionRoot: CompositionRoot;

  beforeEach(async () => {
    compositionRoot = new CompositionRoot();
    await compositionRoot.create();
  });

  it('should load journals', async () => {
    const { presenter } = compositionRoot.getJournalModule();

    if (!presenter) {
      throw new Error('Journal presenter not set up');
    }

    // Act
    await presenter.load();

    // Assert
    expect(presenter.viewModel.journals.length).toBe(0);
  });
});
