import { compositionRoot } from '../shared/compositionRoot/compositionRoot.tsx';
import { Button } from '../components/ui/button.tsx';

export const HomePage = () => {
  const { controller } = compositionRoot.getAuthModule();

  const handleLogin = async () => {
    await controller.login();
  }

  return (
      <div className="container mx-auto grid h-screen justify-center items-center">
        <div className="flex justify-center items-center flex-col gap-12 font-extrabold">
          <h1 className="text-3xl lg:text-6xl text-center">Welcome to PropertyLogger</h1>
          <img className="max-h-[350px]" src="pl-logo.png" alt="PropertyLogger Logo" />
          <Button id="login" onClick={handleLogin}>Login</Button>
        </div>
      </div>
  );
}