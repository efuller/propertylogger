import { CompositionRoot } from '../../shared/compositionRoot/compositionRoot.tsx';
import { MockApiClient } from '../../shared/apiClient/mockApiClient.ts';
import { Member } from './member.model.ts';

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
      data: { id: '1', email: 'admin@test.com'},
    });

    const result = await controller.createMember({email: 'admin@test.com'});
    console.log('result', result);

    expect(result.success).toBe(true);
    expect(result.data).not.toBeNull();

    await controller.setMember(result.data as Member);

    expect(presenter.viewModel.member?.email).toBe('admin@test.com');
  });
});