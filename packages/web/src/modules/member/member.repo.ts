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

  async createMember(member: Member) {
    await this.apiClient.post('/member', {
      data: member
    });
  }

  async getMemberByEmail(email: string) {
    const response = await this.apiClient.get<Member[]>('/member', {
      data: email
    });

    return response.data[0];
  }
}