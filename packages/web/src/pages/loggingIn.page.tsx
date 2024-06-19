import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { MemberPresenter } from '../modules/member/member.presenter.ts';
import { LoginController } from '../modules/login/login.controller.ts';
import { LoginPresenter } from '../modules/login/login.presenter.ts';

interface LoggingInPageProps {
  controller: LoginController;
  presenter: LoginPresenter;
  memberPresenter: MemberPresenter;
}

export const LoggingInPage = observer(({
  controller,
  presenter,
  memberPresenter,
}: LoggingInPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    controller.check();
  }, [controller]);

  useEffect(() => {
    if (presenter.viewModel.redirectTo) {
      navigate(presenter.viewModel.redirectTo);
    }
  }, [navigate, presenter.viewModel.redirectTo]);

  return (
    <div>
      <h1>Logging in...</h1>
      {JSON.stringify(memberPresenter.viewModel) }
    </div>
  );
})