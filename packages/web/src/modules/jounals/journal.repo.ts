import { Journal } from './journal.model.ts';
import { ApiClient } from '../../shared/apiClient/apiClient.ts';
import { action, makeObservable, observable, runInAction } from 'mobx';

export class JournalRepo {
  public journals: Journal[] = [];

  constructor(private apiClient: ApiClient) {
    makeObservable(this, {
      journals: observable,
      getJournals: action,
      createJournal: action,
    });
  }

  async createJournal(journal: Journal) {
    const result = await this.apiClient.post('/journal', {
      data: journal
    });

    runInAction(() => {
      if (!result.data) {
        return;
      }
      this.journals.push({
        title: result.data.title,
        content: result.data.content,
      });
    });
  }

  async getJournals() {
    const response = await this.apiClient.get<Journal[]>('/journal', {} );

    runInAction(() => {
      if (!response.data) {
        return;
      }

      this.journals = [
        ...this.journals,
        ...response.data
      ];
    })
  }
}