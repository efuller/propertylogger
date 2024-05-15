import { redirect, RouteObject } from 'react-router-dom';
import * as jose from 'jose';

import { HomePage } from '../../pages/home.page.tsx';
import { LoggingInPage } from '../../pages/loggingIn.page.tsx';
import { DashboardPage } from '../../pages/app/dashboard.page.tsx';
import { AppPage } from '../../pages/app/app.page.tsx';
import { AuthController } from '../../modules/auth/auth.controller.ts';
import { JournalsPage } from '../../pages/app/journals/journals.page.tsx';
import { JournalController } from '../../modules/jounals/journal.controller.ts';
import { JournalPresenter } from '../../modules/jounals/journal.presenter.ts';
import { NotFoundPage } from '../../pages/404/404.page.tsx';
import { CreatingAccountPage } from '../../pages/creatingAccount.page.tsx';

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
    }
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
    return [
      {
        path: '/creating-account',
        element: <CreatingAccountPage />,
        loader: async (item) => {
          if (!process.env.AUTH0_DOMAIN) {
            throw new Error('AUTH0_DOMAIN is not set');
          }

          if (!process.env.APP_SECRET_KEY) {
            throw new Error('APP_SECRET_KEY is not set');
          }

          const url = new URL(item.request.url);
          const token = url.searchParams.get('session_token');
          const state = url.searchParams.get('state');

          if (!token) {
            return redirect('/');
          }

          const secret = new TextEncoder().encode(process.env.APP_SECRET_KEY);
          const decoded: jose.JWTVerifyResult<CustomJWTPayload> = await jose.jwtVerify(token, secret);

          const created = { state, memberCreate: true };
          const alg = 'HS256'
          const jwt = await new  jose.SignJWT(created)
            .setIssuedAt()
            .setSubject(decoded.payload.data.user.user_id)
            .setProtectedHeader({ alg, typ: 'JWT' })
            .setIssuer(process.env.AUTH0_DOMAIN)
            .setExpirationTime('2h')
            .sign(secret);

          const continueUri = `${decoded.payload.continue_uri}?state=${state}&session_token=${jwt}`;

          return redirect(continueUri);
        }
      },
      {
        path: '/logging-in',
        element: <LoggingInPage />,
        loader: async () => {
          await this.authController.isAuthenticated();

          if (hasAuthParams()) {
              await this.authController.handleRedirectCallback();
          }
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

