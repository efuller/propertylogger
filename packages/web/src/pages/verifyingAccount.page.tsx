import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';

import { VerificationController } from '../modules/verification/application/verification.controller.ts';
import { VerificationPresenter } from '../modules/verification/presentation/verification.presenter.ts';

interface VerifyingAccountPageProps {
  controller: VerificationController;
  presenter: VerificationPresenter;
}

export const VerifyingAccountPage = observer(({controller, presenter}: VerifyingAccountPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const result = await controller.execute(window.location.href);

      if (!result.success) {
        navigate('/');
        return;
      }

      navigate('/account/creating');
    }
    verify();
  }, [controller, navigate]);

  return (
    <div>
      <h1>Verifying Account...</h1>
      {JSON.stringify(presenter.viewModel)}
    </div>
  );
});