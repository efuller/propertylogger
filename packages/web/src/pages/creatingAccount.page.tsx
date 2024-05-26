import { VerificationPresenter } from '../modules/verification/presentation/verification.presenter.ts';
import { useEffect } from 'react';

interface CreatingAccountPageProps {
  verificationPresenter: VerificationPresenter;
}
export const CreatingAccountPage = ({ verificationPresenter }: CreatingAccountPageProps) => {

  useEffect(() => {
    window.location.href = verificationPresenter.viewModel.continueUri;
  }, [verificationPresenter.viewModel.continueUri]);

  return (
    <div>
      <h1>Creating Account...</h1>
      {JSON.stringify(verificationPresenter.viewModel)}
    </div>
  );
}