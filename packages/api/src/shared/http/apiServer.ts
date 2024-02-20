import { Server } from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import { ProcessService } from '@efuller/shared';
import { JournalController } from '@efuller/api/src/modules/journals/journal.controller';

interface Controllers {
  journal: JournalController;
}

export class ApiServer {
  private server: Server | null;
  private app: Application;
  private readonly port: number;
  private running: boolean;

  constructor(private readonly controllers: Controllers) {
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

    this.app.get('/journal', async (req, res) => {
      await this.controllers.journal.getAll(req, res);
    });

    this.app.post('/journal', async (req, res) => {
      await this.controllers.journal.create(req, res);
    });
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