import { Request, Response } from 'express';
import { JournalService } from '../application/journal.service';
import { JournalDto } from '@efuller/api/src/modules/journals/application/journal.dto';

export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  async create(req: Request, res: Response) {
    const { title, content = '' } = req.body;

    const dto = JournalDto.create({ title, content });
    const result = await this.journalService.createJournal(dto);

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