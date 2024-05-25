import { PuppeteerPageDriver } from '../../webDriver/puppeteerPageDriver';
import { BasePageComponent } from '../basePageComponent';

type AcceptElements = {
  acceptButton: { selector: string };
};

export class AcceptButton extends BasePageComponent<AcceptElements> {
  constructor(
    protected pageDriver: PuppeteerPageDriver,
    protected componentConfig: AcceptElements,
  ) {
    super(pageDriver, componentConfig);
  }

  async click() {
    await this.waitAndClick('acceptButton')
  }
}