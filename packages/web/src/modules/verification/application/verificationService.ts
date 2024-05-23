import { VerificationData } from '../domain/verificationData.ts';

export interface VerificationService {
  verifyUser(url: string): Promise<VerificationData>;
}