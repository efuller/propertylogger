import { compositionRoot } from '../shared/compositionRoot/compositionRoot.tsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoggingInPage = () => {
  const navigate = useNavigate();
  const { controller} = compositionRoot.getAuthModule();

  useEffect(() => {
    async function check() {
      const isAuthenticated = await controller.isAuthenticated();
      if (isAuthenticated) {
        navigate('/app/dashboard');
      } else {
        navigate('/');
      }
    }
    check();
  }, [controller, navigate]);
  return (
    <div>
      <h1>Logging in...</h1>
    </div>
  );
}