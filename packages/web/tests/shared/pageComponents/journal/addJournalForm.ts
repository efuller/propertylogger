import { PuppeteerPageDriver } from '../../webDriver/puppeteerPageDriver';
import { BasePageComponent } from '../basePageComponent';

type AddJournalFormElements = {
  titleInput: { selector: string };
  contentInput: { selector: string };
  submitBtn: { selector: string };
};

export class AddJournalFormComponent extends BasePageComponent<AddJournalFormElements> {
  constructor(
    protected pageDriver: PuppeteerPageDriver,
    protected componentConfig: AddJournalFormElements,
  ) {
    super(pageDriver, componentConfig);
  }

  async addAndSubmit(title: string, content: string) {
    await this.waitAndType('titleInput', title);
    await this.waitAndType('contentInput', content);
    await this.waitAndClick('submitBtn');
  }
}