import { computed, makeObservable } from 'mobx';
import { VerificationRepo } from '../infra/verification.repo.ts';

export class VerificationPresenter {
  get viewModel() {
    const { verifiedData } = this.verificationRepo;

    return {
      isVerified: !!verifiedData.userId,
      continueUri: verifiedData.continueUri,
      userId: verifiedData.userId,
    }
  }

  constructor(
    private verificationRepo: VerificationRepo,
  ) {
    makeObservable(this, {
      viewModel: computed
    });
  }
}
