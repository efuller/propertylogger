import { Outlet } from 'react-router-dom';

export const AppPage = () => {
  return (
    <>
      <div>This is the App</div>
      <div>
        <Outlet />
      </div>
    </>
  );
}