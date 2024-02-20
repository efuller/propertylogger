import { PuppeteerPageDriver } from '../webDriver/puppeteerPageDriver';
import { JournalList } from '../pageComponents/journal/journalList';
import { AddJournalFormComponent } from '../pageComponents/journal/addJournalForm';
import { BasePage } from './basePage';

type HomepageComponents = {
  addJournalForm: AddJournalFormComponent;
  journalList: JournalList;
};

export class HomePage extends BasePage<HomepageComponents> {
  protected constructor(
    protected pageDriver: PuppeteerPageDriver,
    protected url: string,
  ) {
    super(pageDriver, url);
  }

  static async create(pageDriver: PuppeteerPageDriver, url: string) {
    const page = new HomePage(pageDriver, url);
    page.pageComponents = await page.generatePageComponents();
    return page;
  }

  async generatePageComponents() {
    const addJournalForm = new AddJournalFormComponent(this.pageDriver, {
      titleInput: { selector: '#title' },
      contentInput: { selector: '#content' },
      submitBtn: { selector: '#submit' },
    });

    const journalList = new JournalList(this.pageDriver, {
      journalList: { selector: '#journal-list' },
      journalEntries: { selector: '.journal-entry' },
      journalTitle: { selector: '.journal-title' },
      journalContent: { selector: '.journal-content' },
    });

    return { addJournalForm, journalList };
  }
}