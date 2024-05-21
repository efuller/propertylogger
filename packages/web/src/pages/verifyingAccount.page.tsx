import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VerificationController } from '../modules/verification/application/verification.controller.ts';

// NOTE: I've branched off of feature/register-member

interface VerifyingAccountPageProps {
  controller: VerificationController;
}

export const VerifyingAccountPage = ({controller}: VerifyingAccountPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const maybeContinueOrNot = await controller.execute(window.location.href);

      if (!maybeContinueOrNot.success) {
        navigate('/');
      }

      window.location.href = maybeContinueOrNot.data.continueUri;
    }
    verify();
  }, [controller, navigate]);

  return (
    <div>
      <h1>Creating Account...</h1>
    </div>
  );
}