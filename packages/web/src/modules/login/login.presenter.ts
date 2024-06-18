import { computed, makeObservable } from 'mobx';
import { LoginRepo } from './login.repo.ts';

export class LoginPresenter {
  public constructor(
    private loginRepo: LoginRepo,
  ) {
    makeObservable(this, {
      viewModel: computed
    });
  }

  get viewModel() {
    return {
      redirectTo: this.loginRepo.redirectTo
    }
  }
}