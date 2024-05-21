import { VerificationData } from '../application/verification.controller.ts';
import { action, makeObservable, observable } from 'mobx';

export class VerificationRepo {
  public verifiedData: VerificationData;

  constructor() {
    makeObservable(this, {
      verifiedData: observable,
      update: action,
    });
    this.verifiedData = {
      userId: '',
      continueUri: '',
    };
  }

  update(data: VerificationData) {
    this.verifiedData = data;
  }
}