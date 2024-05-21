import { VerificationService } from '../application/verificationService.ts';
import { Spy } from '@efuller/api/tests/shared/spy.ts';

export class MockVerificationService extends Spy implements VerificationService {
    private defaultResponse = { userId: '12345', continueUri: '/create-member' };

    constructor() {
        super();
    }

    async verifyUser(url: string): Promise<{ userId: string | null; continueUri: string; }> {
        this.addCall('verifyUser', {params: [url], calledBy: 'VerificationService'})
        return this.defaultResponse;
    }
}