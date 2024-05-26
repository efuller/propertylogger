import { CompositionRoot } from '../../shared/compositionRoot/compositionRoot.tsx';

describe('Member', () => {
  let compositionRoot: CompositionRoot;

  beforeEach(async () => {
    compositionRoot = new CompositionRoot('test');
    await compositionRoot.create();
  });

  it('should load member by email address', async () => {
    const { presenter } = compositionRoot.getMemberModule();
    expect(presenter.viewModel.member).toBeNull();
  });

  it.todo('should create new member');
});