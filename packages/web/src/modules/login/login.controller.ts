import { AuthController } from '../auth/auth.controller.ts';
import { LoginRepo } from './login.repo.ts';
import { MemberController } from '../member/member.controller.ts';

export class LoginController {
  constructor(
    private authController: AuthController,
    private memberController: MemberController,
    private loginRepo: LoginRepo,
  ) {}

  public async check() {
    const isAuthenticated = await this.authController.isAuthenticated();

    if (!isAuthenticated) {
      this.loginRepo.setRedirectTo('/');
      return;
    }

    const user = await this.authController.getUser();
    const isMember = await this.memberController.getMemberByEmail(user?.email || '');

    if (isMember.success && isMember.data) {
      await this.memberController.setMember(isMember.data);
      this.loginRepo.setRedirectTo('/app/dashboard');
      return;
    }

    const result = await this.memberController.createMember({
      email: user?.email || '',
    });

    if (!result.success || !result.data) {
      this.loginRepo.setRedirectTo('/');
      return;
    }

    await this.memberController.setMember(result.data);

    this.loginRepo.setRedirectTo('/app/dashboard');

    return;
  }
}