import { VerificationService } from '../application/verificationService.ts';
import { Spy } from '@efuller/api/tests/shared/spy.ts';
import { VerificationData } from '../domain/verificationData.ts';

export class MockVerificationService extends Spy implements VerificationService {
    private defaultResponse: VerificationData = { success: true, userId: '12345', continueUri: '/create-member' };

    constructor() {
        super();
    }

    async verifyUser(url: string): Promise<VerificationData> {
        this.addCall('verifyUser', {params: [url], calledBy: 'VerificationService'})
        return this.defaultResponse;
    }

    setDefaultResponse(response: VerificationData) {
        this.defaultResponse = response;
    }
}