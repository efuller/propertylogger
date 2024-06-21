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
import { MemberController } from '../../modules/member/member.controller.ts';
import { MemberPresenter } from '../../modules/member/member.presenter.ts';
import { AuthPresenter } from '../../modules/auth/auth.presenter.ts';
import { LoginPresenter } from '../../modules/login/login.presenter.ts';
import { LoginController } from '../../modules/login/login.controller.ts';

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
    private authModule: {
      controller: AuthController;
      presenter: AuthPresenter;
    },
    private journalModule: {
      presenter: JournalPresenter | undefined;
      controller: JournalController | undefined;
    },
    private memberModule: {
      controller: MemberController | undefined;
      presenter: MemberPresenter | undefined;
    },
    private loginModule: {
      controller: LoginController | undefined;
      presenter: LoginPresenter | undefined;
    }
  ) {}

  private async protectedLoader() {
    const isAuthenticated = await this.authModule.controller.isAuthenticated()

    if (!isAuthenticated) {
      // TODO: How to redirect back to the current page after login?
      return redirect('/');
    }

    return null;
  }

  getRouteMap(): RouteObject[] {
    if (!this.authModule.presenter || !this.authModule.controller) {
      throw new Error('Journal controller is not initialized');
    }

    if (!this.journalModule.presenter || !this.journalModule.controller) {
      throw new Error('Journal controller is not initialized');
    }

    if (!this.memberModule.controller || !this.memberModule.presenter) {
      throw new Error('Member controller or presenter is not initialized');
    }

    if (!this.loginModule.controller || !this.loginModule.presenter) {
      throw new Error('Login controller or presenter is not initialized');
    }

    return [
      {
        path: '/logging-in',
        element: <LoggingInPage
          controller={this.loginModule.controller}
          presenter={this.loginModule.presenter}
          memberPresenter={this.memberModule.presenter}
        />,
        loader: async () => {
          const hasParams = hasAuthParams();

          if (!hasParams) {
            return redirect('/');
          }

          await this.authModule.controller.handleRedirectCallback();

          return null;
        }
      },
      {
        path: '/',
        element: <HomePage />,
        loader: async () => {
          await this.authModule.controller.isAuthenticated();
          return null;
        }
      },
      {
        path: 'app',
        element: <AppPage
          authController={this.authModule.controller}
          memberPresenter={this.memberModule.presenter}
        />,
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

