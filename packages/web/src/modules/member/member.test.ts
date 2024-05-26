import { CompositionRoot } from '../../shared/compositionRoot/compositionRoot.tsx';
import { MockApiClient } from '../../shared/apiClient/mockApiClient.ts';

describe('Member', () => {
  let compositionRoot: CompositionRoot;

  beforeEach(async () => {
    compositionRoot = new CompositionRoot('test');
    await compositionRoot.create();
  });

  it('should create new member', async () => {
    const { presenter, controller } = compositionRoot.getMemberModule();
    expect(presenter.viewModel.member).toBeNull();
    const apiClient = compositionRoot.getApiClient() as MockApiClient;
    apiClient.setPostResponse({
      success: true,
      error: false,
      data: [{ id: '1', email: 'admin@test.com'}],
    });

    await controller.createMember({email: 'admin@test.com'});
    await presenter.load('admin@test.com');

    expect(presenter.viewModel.member?.email).toBe('admin@test.com');
  });
});