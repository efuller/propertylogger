import { computed, makeObservable } from 'mobx';
import { MemberRepo } from './member.repo.ts';

export class MemberPresenter {
  get viewModel() {
    return {
      member: this.memberRepo.member
    }
  }

  constructor(
    private memberRepo: MemberRepo
  ) {
    makeObservable(this, {
      viewModel: computed
    });
  }

  async load(email: string) {
    const result = await this.memberRepo.getMemberByEmail(email);

    if (!result.success || !result.data) {
      return;
    }
    await this.memberRepo.setMember(result.data);
  }
}