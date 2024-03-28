import { Journal } from './journal.model.ts';
import { ApiClient } from '../../shared/apiClient/apiClient.ts';
import { action, makeObservable, observable } from 'mobx';

export class JournalRepo {
  public journals: Journal[] = [];

  constructor(private apiClient: ApiClient) {
    makeObservable(this, {
      journals: observable,
      getJournals: action,
    })
  }

  async createJournal(journal: Journal) {
    await this.apiClient.post('/journal', {
      data: journal
    });
  }

  async getJournals() {
    const response = await this.apiClient.get<Journal[]>('/journal', {} );
    this.journals = response.data;
  }
}