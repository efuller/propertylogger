import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { AuthController } from '../../modules/auth/auth.controller.ts';
import { AuthPresenter } from '../../modules/auth/auth.presenter.ts';
import { MemberPresenter } from '../../modules/member/member.presenter.ts';
import { Button } from '@/components/ui/button.tsx';

interface DashboardPageProps {
  authController: AuthController;
  authPresenter: AuthPresenter;
  memberPresenter: MemberPresenter;
}

export const DashboardPage = observer(({
  authController,
  authPresenter,
  memberPresenter,
}: DashboardPageProps) => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await authController.login();
  }

  const handleLogOut = async () => {
    await authController.logout();
    navigate('/');
  }

  const handleAmIAuthenticated = async () => {
    await authController.isAuthenticated();
  }

  if (!authPresenter.viewModel.isAuthenticated) {
    return (
      <div>
        <p>not logged in</p>
        <h1>Welcome to PropertyLogger</h1>
        <button onClick={handleLogin}>Login</button>
        <button id="authed" onClick={handleAmIAuthenticated}>authed</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">
        You have no properties
      </h3>
      <p className="text-sm text-muted-foreground">
        You can start managing tasks as soon as you add a property.
      </p>
      <Button className="mt-4">Add Property</Button>
      <div>
        <h1>Welcome to PropertyLogger</h1>
        <button onClick={handleLogOut}>logout</button>
        <button id="authed" onClick={handleAmIAuthenticated}>{
          memberPresenter.viewModel.member?.email || 'no email'
        }</button>
        <Link to='/app/journals'>Journals</Link>
      </div>
    </div>
  );
})