import { action, makeObservable, observable } from 'mobx';
import { VerificationData } from '../domain/verificationData.ts';

export class VerificationRepo {
  public verifiedData: VerificationData;

  constructor() {
    makeObservable(this, {
      verifiedData: observable,
      update: action,
    });
    this.verifiedData = {
      success: false,
      userId: '',
      continueUri: '',
    };
  }

  update(data: VerificationData) {
    this.verifiedData = data;
  }
}