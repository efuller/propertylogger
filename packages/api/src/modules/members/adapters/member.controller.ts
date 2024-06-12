import { Request, Response } from 'express';
import { MemberService } from '@efuller/api/src/modules/members/application/memberService';
import { CreateMemberDto } from '@efuller/api/src/modules/members/application/member.dto';

export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  async create(req: Request, res: Response) {
    const { email } = req.body;

    const dto: CreateMemberDto = {email};
    const result = await this.memberService.createMember(dto);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(201).json(result);
  }

  async getMemberByEmail(req: Request, res: Response) {
    const result = await this.memberService.getMemberByEmail(req.params.email)

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json(result);
  }
}