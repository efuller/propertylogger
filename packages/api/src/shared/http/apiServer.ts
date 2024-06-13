import { Server } from 'http';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ProcessService } from '@efuller/shared';
import { WebApp } from '@efuller/api/src/shared/application';
import { JournalController } from '@efuller/api/src/modules/journals/adapters/journal.controller';
import { AuthMiddleware } from '@efuller/api/src/modules/auth/infra/middleware/authMiddleware';
import { MemberController } from '@efuller/api/src/modules/members/adapters/member.controller';

export class ApiServer {
  private server: Server | null;
  private express: Application;
  private readonly port: number;
  private running: boolean;

  constructor(private app: WebApp) {
    const env = process.env.NODE_ENV || 'development';
    this.server = null;
    this.express = express();
    this.express.use(express.json());
    this.express.use(cors());
    this.port = env === 'development' ? 3000 : 3001;
    this.running = false;

    this.setupRoutes();
  }

  private setupRoutes() {
    const authMiddleware = new AuthMiddleware(this.app.auth);
    const journalService = this.app.journals;
    const journalController = new JournalController(journalService);
    const memberController = new MemberController(this.app.members);

    this.express.get('/', (req, res) => {
      res.send({ ok: true }).status(200);
    });

    this.express.get('/health', (req, res) => {
      res.send({ ok: true }).status(200);
    });

    this.express.get(
      '/journal',
      authMiddleware.handle(),
      async (req, res) => {
        await journalController.getAll(req, res);
      });

    this.express.post(
      '/journal',
      async (req, res) => {
        await journalController.create(req, res);
      });

    this.express.post(
      '/member',
      async (req, res) => {
        await memberController.create(req, res);
      });

    this.express.get('/protected', authMiddleware.handle(), async (req, res) => {
      res.send({ ok: true }).status(200);
    });

    this.express.use(function(err: Error, req: Request, res: Response, next: NextFunction) {
      console.log('error', err);
      if (err.name === "UnauthorizedError") {
        return res.status(401).send({ msg: "Invalid token" });
      }

      next(err);
    });
  }

  async start() {
    const env = process.env.NODE_ENV || 'development';

    if (env === 'development') {
      await ProcessService.killProcessOnPort(this.port);
    }

    return new Promise((resolve) => {
      this.server = this.express.listen(
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