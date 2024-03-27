import { redirect, RouteObject } from 'react-router-dom';
import { HomePage } from '../../pages/home.page.tsx';
import { LoggingInPage } from '../../pages/loggingIn.page.tsx';
import { DashboardPage } from '../../pages/app/dashboard.page.tsx';
import { AppPage } from '../../pages/app/app.page.tsx';
import { AuthController } from '../../modules/auth/auth.controller.ts';

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

export const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) &&
  STATE_RE.test(searchParams);

export class AppRouter {
  constructor(private authController: AuthController) {}

  private async isAuthenticated() {
    if (!this.authController.authInitialized()) {
      await this.authController.initializeAuth();
    }

    const isAuthenticated = await this.authController.isAuthenticated()

    if (!isAuthenticated) {
      return false;
    }

    return true;
  }

  public async initialize() {
    if (!this.authController.authInitialized()) {
      await this.authController.initializeAuth();
    }
  }

  getRouteMap(): RouteObject[] {
    return [
      {
        path: '/logging-in',
        element: <LoggingInPage />,
        loader: async () => {
          await this.initialize();
          await this.authController.isAuthenticated();
          if (hasAuthParams()) {
            await this.authController.handleRedirectCallback();
          } else {
            await this.authController.refreshSession();
            await this.isAuthenticated();
            return redirect('/app/dashboard');
          }
          return redirect('/app/dashboard');
        }
      },
      {
        path: '/',
        element: <HomePage />,
        loader: async () => {
          await this.initialize();
          return null;
        }
      },
      {
        path: 'app',
        element: <AppPage />,
        loader: async () => {
          const authenticated = await this.isAuthenticated();

          if (!authenticated) {
            return redirect('/');
          }
          return null;
        },
        children: [
          {
            path: '/app/dashboard',
            element: <DashboardPage />,
          },
        ]
      }
    ];
  }
}

