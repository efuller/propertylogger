import { PuppeteerPageDriver } from '../../webDriver/puppeteerPageDriver';
import { BasePageComponent } from '../basePageComponent';

type LoginElements = {
  loginButton: { selector: string };
};

export class LoginButton extends BasePageComponent<LoginElements> {
  constructor(
    protected pageDriver: PuppeteerPageDriver,
    protected componentConfig: LoginElements,
  ) {
    super(pageDriver, componentConfig);
  }

  async click() {
    await this.waitAndClick('loginButton')
  }
}