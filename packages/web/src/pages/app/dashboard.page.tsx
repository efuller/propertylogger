import { compositionRoot } from '../../compositionRoot.tsx';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { controller, presenter } = compositionRoot.getAuthModule();

  const handleLogin = async () => {
    await controller.login();
  }

  const handleLogOut = async () => {
    await controller.logout();
    navigate('/');
  }

  const handleAmIAuthenticated = async () => {
    const result = await controller.isAuthenticated();
    console.log('authenticated', result);
  }

  // TODO: This needs to be async
  if (!presenter.viewModel.isAuthenticated) {
    return (
      <div>
        <p>not logged in</p>
        <h1>Welcome to PropertyLogger</h1>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleAmIAuthenticated}>authed</button>
      </div>
    );
  }

  return (
    <>
      <div>New HomePage logged in</div>
      <div>
        <h1>Welcome to PropertyLogger</h1>
        <button onClick={handleLogOut}>logout</button>
        <button onClick={handleAmIAuthenticated}>authed</button>
      </div>
    </>
  );
}