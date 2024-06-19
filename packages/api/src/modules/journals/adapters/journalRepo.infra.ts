import { PrismaJournalRepo } from '@efuller/api/src/modules/journals/adapters/prismaJournal.repo';
import { PrismaDbClient } from '@efuller/api/src/shared/persistence/prismaClient/prismaDbClient';
import { CreateJournalDto } from '@efuller/api/src/modules/journals/application/journal.dto';
import { InMemoryJournalRepo } from '@efuller/api/src/modules/journals/adapters/inMemoryJournal.repo';

describe('JournalRepo', () => {
  const journalRepos = [
    new InMemoryJournalRepo(),
    new PrismaJournalRepo(new PrismaDbClient())
  ];

  it('can save an retrieve members by their email', async () => {
    const journalDto: CreateJournalDto = {
      title: 'Test',
      content: 'Test Content',
    };

    for (const journalRepo of journalRepos) {
      const journal = await journalRepo.createJournal(journalDto);

      expect(journal.success).toBeTruthy();
      expect(journal.data?.title).toBe(journalDto.title);

      const retrievedJournal = await journalRepo.getJournals()

      expect(retrievedJournal.success).toBeTruthy();
      expect(retrievedJournal.data?.length).toBeGreaterThan(0);
      expect(retrievedJournal.data?.[0].title).toBe(journalDto.title);
    }
  });
});
