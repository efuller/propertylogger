import { action, makeObservable, observable } from 'mobx';

export class LoginRepo {
  public redirectTo: string = '';

  constructor() {
    makeObservable(this, {
      redirectTo: observable,
      setRedirectTo: action,
    });
  }

  public setRedirectTo(redirectTo: string) {
    this.redirectTo = redirectTo;
  }
}