import { ApiClient } from '../../shared/apiClient/apiClient.ts';
import { makeObservable, observable } from 'mobx';
import { Member } from './member.model.ts';

export class MemberRepo {
  public member: Member | null;

  constructor(private apiClient: ApiClient) {
    makeObservable(this, {
      member: observable,
    });
    this.member = null;
  }
}