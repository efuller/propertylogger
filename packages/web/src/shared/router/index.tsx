import { redirect, RouteObject } from 'react-router-dom';

import { HomePage } from '../../pages/home.page.tsx';
import { LoggingInPage } from '../../pages/loggingIn.page.tsx';
import { DashboardPage } from '../../pages/app/dashboard.page.tsx';
import { AppPage } from '../../pages/app/app.page.tsx';
import { AuthController } from '../../modules/auth/auth.controller.ts';
import { JournalsPage } from '../../pages/app/journals/journals.page.tsx';
import { JournalController } from '../../modules/jounals/journal.controller.ts';
import { JournalPresenter } from '../../modules/jounals/journal.presenter.ts';
import { NotFoundPage } from '../../pages/404/404.page.tsx';
import { VerifyingAccountPage } from '../../pages/verifyingAccount.page.tsx';
import { VerificationController } from '../../modules/verification/application/verification.controller.ts';

export interface CustomJWTPayload {
  data: {
    user: {
      user_id: string;
    };
  };
}

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

export const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) &&
  STATE_RE.test(searchParams);

export class AppRouter {
  constructor(
    private authController: AuthController,
    private journalModule: {
      presenter: JournalPresenter | undefined;
      controller: JournalController | undefined;
    },
    private verificationModule: {
      controller: VerificationController | undefined;
    },
  ) {}

  private async protectedLoader() {
    const isAuthenticated = await this.authController.isAuthenticated()

    if (!isAuthenticated) {
      // TODO: How to redirect back to the current page after login?
      return redirect('/');
    }

    return null;
  }

  getRouteMap(): RouteObject[] {
    if (!this.journalModule.presenter || !this.journalModule.controller) {
      throw new Error('Journal controller is not initialized');
    }

    if (!this.verificationModule.controller) {
      throw new Error('Verification controller is not initialized');
    }

    return [
      {
        path: '/account',
        element: <VerifyingAccountPage controller={this.verificationModule.controller} />,
        children: [
          {
            path: 'creating-account',
            element: <VerifyingAccountPage controller={this.verificationModule.controller} />,
          },
        ]
      },
      {
        path: '/logging-in',
        element: <LoggingInPage />,
        loader: async () => {
          const hasParams = hasAuthParams();

          if (!hasParams) {
            return redirect('/');
          }

          await this.authController.handleRedirectCallback();

          return redirect('/app/dashboard');
        }
      },
      {
        path: '/',
        element: <HomePage />,
        loader: async () => {
          await this.authController.isAuthenticated();
          return null;
        }
      },
      {
        path: 'app',
        element: <AppPage />,
        loader: this.protectedLoader.bind(this),
        children: [
          {
            path: '/app/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/app/journals',
            element: <JournalsPage presenter={this.journalModule.presenter} controller={this.journalModule.controller} />,
          },
        ]
      },
      {
        path: '*',
        element: <NotFoundPage />,
      }
    ];
  }
}

