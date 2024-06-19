import { PuppeteerPageDriver } from '../../webDriver/puppeteerPageDriver';
import { BasePageComponent } from '../basePageComponent';

type RegisterFormElements = {
  userName: { selector: string };
  password: { selector: string };
  submitBtn: { selector: string };
};

export class RegisterForm extends BasePageComponent<RegisterFormElements> {
  constructor(
    protected pageDriver: PuppeteerPageDriver,
    protected componentConfig: RegisterFormElements,
  ) {
    super(pageDriver, componentConfig);
  }

  async fillAndSubmitForm() {
    await this.waitAndType('userName', process.env.TEST_USER_EMAIL || '');
    await this.waitAndType('password', process.env.TEST_USER_PASSWORD || '');
    await this.waitAndClick('submitBtn');
  }
}