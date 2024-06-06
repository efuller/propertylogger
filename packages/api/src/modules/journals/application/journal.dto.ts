export type CreateJournalDto = Omit<JournalDto, 'id'>;

export type JournalDto = {
  id: string;
  title: string;
  content: string;
}