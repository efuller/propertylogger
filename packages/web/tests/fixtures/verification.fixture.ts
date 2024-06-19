import { CompositionRoot } from '../../src/shared/compositionRoot/compositionRoot';
import { MockVerificationService } from '../../src/modules/verification/infra/mockVerification.service';
import { VerificationData } from '../../src/modules/verification/domain/verificationData';

export class VerificationFixture {
  constructor(private compositionRoot: CompositionRoot) {}

  setVerificationResponse(response: VerificationData) {
    const verificationService = this.compositionRoot.getVerificationModule().verificationService as MockVerificationService;
    verificationService.setDefaultResponse(response)
  }
}