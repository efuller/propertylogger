import { PuppeteerPageDriver } from '../../webDriver/puppeteerPageDriver';
import { BasePageComponent } from '../basePageComponent';

type RegisterElements = {
  registerLink: { selector: string };
};

export class RegisterLink extends BasePageComponent<RegisterElements> {
  constructor(
    protected pageDriver: PuppeteerPageDriver,
    protected componentConfig: RegisterElements,
  ) {
    super(pageDriver, componentConfig);
  }

  async click() {
    await this.waitAndClick('registerLink')
  }
}