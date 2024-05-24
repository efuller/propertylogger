import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VerificationController } from '../modules/verification/application/verification.controller.ts';
import { VerificationPresenter } from '../modules/verification/presentation/verification.presenter.ts';

interface VerifyingAccountPageProps {
  controller: VerificationController;
  presenter: VerificationPresenter;
}

export const VerifyingAccountPage = ({controller}: VerifyingAccountPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const result = await controller.execute(window.location.href);

      if (!result.success) {
        navigate('/');
        return;
      }

      window.location.href = result.data.continueUri;
    }
    verify();
  }, [controller, navigate]);

  return (
    <div>
      <h1>Verifying Account...</h1>
    </div>
  );
}