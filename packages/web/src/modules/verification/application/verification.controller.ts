import { VerificationService } from './verificationService.ts';
import { VerificationRepo } from '../infra/verification.repo.ts';
import { VerificationData } from '../domain/verificationData.ts';

export interface VerificationResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly verificationRepository: VerificationRepo,
  ) {}

  async execute(url: string): Promise<VerificationResponse<VerificationData>> {
    const result = await this.verificationService.verifyUser(url);

    this.verificationRepository.update({
      userId: result.userId,
      continueUri: result.continueUri,
      success: result.success,
    });

    return {
      success: result.success,
      message: result.success ? 'User verified' : 'User not verified',
      data: result,
    }
  }
}