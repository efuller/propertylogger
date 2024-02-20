import { Request, Response } from 'express';
import { JournalService } from './journal.service';

export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  async create(req: Request, res: Response) {
    const { title, content = '' } = req.body;

    const result = await this.journalService.createJournal(title, content);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const result = await this.journalService.getJournals();

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json(result);
  }
}