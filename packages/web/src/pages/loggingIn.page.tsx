import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { AuthController } from '../modules/auth/auth.controller.ts';
import { MemberController } from '../modules/member/member.controller.ts';
import { MemberPresenter } from '../modules/member/member.presenter.ts';

interface LoggingInPageProps {
  controller: AuthController;
  memberController: MemberController;
  memberPresenter: MemberPresenter;
}

export const LoggingInPage = observer(({
  controller,
  memberController,
  memberPresenter,
}: LoggingInPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    async function check() {
      const isAuthenticated = await controller.isAuthenticated();
      if (isAuthenticated) {
        const user = await controller.getUser();
        const isMember = await memberController.getMemberByEmail(user?.email || '');

        if (!isMember.success || !isMember.data) {
          const result = await memberController.createMember({
            email: user?.email || '',
          });
          if (result.success && result.data) {
            await memberController.setMember(result.data);
            navigate('/app/dashboard');
          }
        }
        // Check to see if there is a registered member.
        const member = await memberController.getMemberByEmail(user!.email);

        if (member.success && member.data) {
          await memberController.setMember(member.data);
          navigate('/app/dashboard');
        } else {
          navigate('/');
        }
      }
    }
    check();
  }, [controller, memberController, navigate]);
  return (
    <div>
      <h1>Logging in...</h1>
      {JSON.stringify(memberPresenter.viewModel) }
    </div>
  );
})