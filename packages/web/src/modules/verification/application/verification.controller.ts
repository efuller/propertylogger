import { VerificationService } from './verificationService.ts';
import { VerificationRepo } from '../infra/verification.repo.ts';

interface ControllerResult<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface VerificationData {
  userId: string;
  continueUri: string;
}

export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly verificationRepository: VerificationRepo,
  ) {}

  async execute(url: string): Promise<ControllerResult<VerificationData>> {
    const result = await this.verificationService.verifyUser(url);

    if (result.userId) {
      this.verificationRepository.update({ userId: result.userId, continueUri: result.continueUri});
      return {
        success: true,
        message: 'User verified',
        data: {userId: result.userId, continueUri: result.continueUri}
      };
    }

    return {
      success: false,
      message: 'User not verified',
      data: {userId: '', continueUri: ''}
    };
  }
}