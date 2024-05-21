export interface VerificationService {
  verifyUser(url: string): Promise<{userId: string | null, continueUri: string}>;
}