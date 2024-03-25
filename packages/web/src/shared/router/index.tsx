import { redirect, RouteObject } from 'react-router-dom';
import { AuthApi } from '../../modules/auth/auth.api.ts';

export class AppRouter {
  private async protectedRoute() {
    const isAuthenticated = this.authApi.isAuthenticated();

    if (!isAuthenticated) {
      await this.authApi.login();
    }

    redirect('/login');
  }

  constructor(private authApi: AuthApi) {}

  getRouteMap(): RouteObject[] {
    return [
      {
        path: '/',
        element: <div>HomePage</div>,
        loader: async () => {
          console.log('loader', this);
          await this.protectedRoute();
          return null;
        }
      }
    ];
  }
}

