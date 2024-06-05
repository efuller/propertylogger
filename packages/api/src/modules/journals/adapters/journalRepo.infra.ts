import { PrismaJournalRepo } from '@efuller/api/src/modules/journals/adapters/prismaJournal.repo';
import { PrismaDbClient } from '@efuller/api/src/shared/persistence/prismaClient/prismaDbClient';
import { JournalDto } from '@efuller/api/src/modules/journals/application/journal.dto';

describe('JournalRepo', () => {
  const journalRepos = [
    new PrismaJournalRepo(new PrismaDbClient())
  ];

  it('can save an retrieve members by their email', async () => {
    const journalDto: JournalDto = JournalDto.create({
      title: 'Test',
      content: 'Test Content',
    });

    for (const journalRepo of journalRepos) {
      const journal = await journalRepo.createJournal(journalDto.props.title, journalDto.props?.content || '');

      expect(journal.success).toBeTruthy();
      expect(journal.data?.title).toBe(journalDto.props.title);

      const retrievedJournal = await journalRepo.getJournals()

      expect(retrievedJournal.success).toBeTruthy();
    }
  });
});
