export type CreateMemberDto = Omit<MemberDto, 'id'>;

export type MemberDto = {
  id: string;
  email: string;
}