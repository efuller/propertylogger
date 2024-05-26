import { computed, makeObservable } from 'mobx';
import { MemberRepo } from './member.repo.ts';

export class MemberPresenter {
  get viewModel() {
    return {
      member: this.memberRepo.member
    }
  }

  constructor(private memberRepo: MemberRepo) {
    makeObservable(this, {
      viewModel: computed
    });
  }
}