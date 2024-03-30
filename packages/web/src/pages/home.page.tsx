import { compositionRoot } from '../compositionRoot.tsx';

export const HomePage = () => {
  const { controller } = compositionRoot.getAuthModule();

  const handleLogin = async () => {
    if (!controller) {
      throw new Error('Controller not set up');
    }
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