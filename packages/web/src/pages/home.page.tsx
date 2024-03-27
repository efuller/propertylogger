import { compositionRoot } from '../compositionRoot.tsx';

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
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
}