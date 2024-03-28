import { computed, makeObservable } from 'mobx';
import { AuthRepo } from './auth.repo.ts';

export class AuthPresenter {
  get viewModel() {
    return {
      isAuthenticated: this.authRepo.authenticated,
    };
  }

  constructor(
    private authRepo: AuthRepo,
  ) {
    makeObservable(this, {
      viewModel: computed,
    });
  }

  async load() {}
}

