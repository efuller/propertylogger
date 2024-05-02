import { compositionRoot } from '../shared/compositionRoot/compositionRoot.tsx';

export const HomePage = () => {
  const { controller } = compositionRoot.getAuthModule();

  const handleLogin = async () => {
    await controller.login();
  }

  return (
    <>
      <div>New HomePage</div>
      <div>
        <h1>Welcome to PropertyLogger</h1>
        <button id="login" onClick={handleLogin}>Login</button>
      </div>
    </>
  );
}