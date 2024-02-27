import { Server } from 'http';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ProcessService } from '@efuller/shared';
import { JournalController } from '@efuller/api/src/modules/journals/journal.controller';
import { auth } from 'express-oauth2-jwt-bearer';

interface ApiServerRouters {
  journal: JournalRouter;
}

export class JournalRouter {
  private readonly router: express.Router;
  constructor(
    private readonly controller: JournalController
  ) {
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get(
      '/journal',
      (req, res, next) => {
        console.log('journal route', req.headers);
        console.log('Authorization', req.headers.authorization);
        next();
      },
      async (req, res) => {
        console.log('REQ AUTH', req.auth);
        await this.controller.getAll(req, res);
      });

    this.router.post(
      '/journal',
      async (req, res) => {
        await this.controller.create(req, res);
      });
  }

  getRouter() {
    return this.router;
  }
}

export class ApiServer {
  private server: Server | null;
  private app: Application;
  private readonly port: number;
  private running: boolean;

  constructor(private readonly routers: ApiServerRouters) {
    const env = process.env.NODE_ENV || 'development';
    this.server = null;
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.port = env === 'development' ? 3000 : 3001;
    this.running = false;

    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.get('/', (req, res) => {
      res.send({ ok: true }).status(200);
    });

    this.app.get('/health', (req, res) => {
      res.send({ ok: true }).status(200);
    });

    this.app.use(this.routers.journal.getRouter());

    this.app.get('/protected', this.setupAuthMiddleware(), async (req, res) => {
      res.send({ ok: true }).status(200);
    });

    this.app.use(function(err: Error, req: Request, res: Response, next: NextFunction) {
      console.log('error', err);
      if (err.name === "UnauthorizedError") {
        return res.status(401).send({ msg: "Invalid token" });
      }

      next(err);
    });
  }

  private setupAuthMiddleware() {
    const audience = process.env.AUTH0_AUDIENCE || '';
    const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL || '';

    if (!audience || !issuerBaseURL) {
      throw new Error('Missing environment variables for Auth0');
    }

    const jwtCheck = auth({
      audience,
      issuerBaseURL,
      tokenSigningAlg: 'RS256'
    });
    return jwtCheck;
  }

  async start() {
    const env = process.env.NODE_ENV || 'development';

    if (env === 'development') {
      await ProcessService.killProcessOnPort(this.port);
    }

    return new Promise((resolve) => {
      this.server = this.app.listen(
        this.port,
        () => {
          console.log('Server is running on port 3000');
          this.running = true;
          resolve(true);
        }
      );
    });
  }

  async stop() {
    if (!this.isRunning() || !this.server) {
      return;
    }
    this.server.close(() => {
      return new Promise((resolve) => {
        this.running = false;
        resolve(true);
      });
    });
  }

  isRunning() {
    return this.running;
  }

  getServer() {
    if (!this.isRunning()) {
      throw new Error('Server is not running');
    }
    return this.server;
  }
}