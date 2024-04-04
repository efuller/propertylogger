import { JournalRepo } from './journal.repo.ts';
import { computed, makeObservable } from 'mobx';

export class JournalPresenter {
  get viewModel() {
    return {
      journals: this.journalRepo.journals
    }
  }

  constructor(private journalRepo: JournalRepo) {
    makeObservable(this, {
      viewModel: computed
    });
  }

  async getJournals() {
    await this.journalRepo.getJournals();
  }

  async load() {
    await this.getJournals();
  }
}