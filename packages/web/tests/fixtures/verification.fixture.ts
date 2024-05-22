import { CompositionRoot } from '../../src/shared/compositionRoot/compositionRoot';
import { MockVerificationService } from '../../src/modules/verification/infra/mockVerification.service';

export class VerificationFixture {
  constructor(private compositionRoot: CompositionRoot) {}

  setVerificationResponse(response: {userId: string, continueUri: string}) {
    const verificationService = this.compositionRoot.getVerificationModule().verificationService as MockVerificationService;
    verificationService.setDefaultResponse(response)
  }
}