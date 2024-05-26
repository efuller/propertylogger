import { PuppeteerPageDriver } from '../../webDriver/puppeteerPageDriver';
import { BasePageComponent } from '../basePageComponent';

type AuthedElements = {
  authedButton: { selector: string };
};

export class AuthedButton extends BasePageComponent<AuthedElements> {
  constructor(
    protected pageDriver: PuppeteerPageDriver,
    protected componentConfig: AuthedElements,
  ) {
    super(pageDriver, componentConfig);
  }

  async click() {
    await this.waitAndClick('authedButton')
  }
}