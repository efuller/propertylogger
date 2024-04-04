import { JournalRepo } from './journal.repo.ts';
import { Journal } from './journal.model.ts';

export class JournalController {
  constructor(private journalRepo: JournalRepo) {}

  async createJournal(journal: Journal) {
    await this.journalRepo.createJournal(journal);
  }
}