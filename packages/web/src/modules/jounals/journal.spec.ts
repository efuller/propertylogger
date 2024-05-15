import { MockApiClient } from '../../shared/apiClient/mockApiClient.ts';

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

jest.mock('jose', () => ({
  TextEncoder: jest.fn(),
}));

import { CompositionRoot } from '../../shared/compositionRoot/compositionRoot.tsx';

describe('Journal', () => {
  let compositionRoot: CompositionRoot;

  beforeEach(async () => {
    compositionRoot = new CompositionRoot('test');
    await compositionRoot.create();
  });

  it('should load journals', async () => {
    const { presenter } = compositionRoot.getJournalModule();
    const apiClient = compositionRoot.getApiClient() as MockApiClient;
    apiClient.setGetResponse({
      success: true,
      error: false,
      data: [
        {
          id: '1',
          title: 'Journal 1',
          content: 'Journal 1 content',
        },
        {
          id: '2',
          title: 'Journal 2',
          content: 'Journal 2 content',
        },
      ],
    });

    await presenter.load();

    expect(presenter.viewModel.journals.length).toBe(2);
  });

  it('should create a new journal and add it to the list', async () => {
    const { presenter, controller } = compositionRoot.getJournalModule();
    const apiClient = compositionRoot.getApiClient() as MockApiClient;
    apiClient.setPostResponse({
      success: true,
      error: false,
      data: {
        id: '3',
        title: 'Journal 3',
        content: 'Journal 3 content',
      },
    });

    expect(presenter.viewModel.journals.length).toBe(0);

    await controller.createJournal({
      title: 'Journal 3',
      content: 'Journal 3 content',
    });

    expect(presenter.viewModel.journals.length).toBe(1);
  });
});
