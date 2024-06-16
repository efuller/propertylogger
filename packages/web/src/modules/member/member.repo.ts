import { ApiClient } from '../../shared/apiClient/apiClient.ts';
import { action, makeObservable, observable } from 'mobx';
import { Member } from './member.model.ts';

export class MemberRepo {
  public member: Member | null;

  constructor(private apiClient: ApiClient) {
    makeObservable(this, {
      member: observable,
      getMemberByEmail: action,
    });
    this.member = null;
  }

  async createMember(member: Member) {
    await this.apiClient.post('/member', {
      data: member
    });
  }

  async getMemberByEmail(email: string) {
    const response = await this.apiClient.get<Member>(`/member/${email}`, {});

    if (!response.data) {
      return null;
    }

    this.member = {...response.data};

    return this.member;
  }
}