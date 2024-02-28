import express from 'express';
import { AuthMiddleware } from '@efuller/api/src/shared/http/middleware/authMiddleware';
import { JournalController } from '@efuller/api/src/modules/journals/journal.controller';
import { ApiRouter } from '@efuller/api/src/shared/http/routers/router';

export class JournalRouter implements ApiRouter {
  private readonly router: express.Router;
  constructor(
    private readonly authMiddleware: AuthMiddleware,
    private readonly controller: JournalController
  ) {
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get(
      '/journal',
      this.authMiddleware.handle(),
      async (req, res) => {
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
