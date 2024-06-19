import { ApiClient } from '../../shared/apiClient/apiClient.ts';
import { action, makeObservable, observable } from 'mobx';
import { Member } from './member.model.ts';

export class MemberRepo {
  public member: Member | null;

  constructor(private apiClient: ApiClient) {
    makeObservable(this, {
      member: observable,
      getMemberByEmail: action,
      createMember: action,
    });
    this.member = null;
  }

  async createMember(member: Member) {
    const result = await this.apiClient.post('/member', {
      data: member
    });

    return result;
  }

  async getMemberByEmail(email: string) {
    const response = await this.apiClient.get<Member>(`/member/${email}`, {});

    return response;
  }

  async setMember(member: Member) {
    this.member = member;
  }
}