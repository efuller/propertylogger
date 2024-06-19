import { PuppeteerPageDriver } from '../webDriver/puppeteerPageDriver';
import { BasePage } from './basePage';
import { AuthedButton } from '../pageComponents/dashboard/authedButton';

type DashboardComponents = {
  authedButton: AuthedButton;
};

export class DashboardPage extends BasePage<DashboardComponents> {
  protected constructor(
    protected pageDriver: PuppeteerPageDriver,
    protected url: string,
  ) {
    super(pageDriver, url);
  }

  static async create(pageDriver: PuppeteerPageDriver, url: string) {
    const page = new DashboardPage(pageDriver, url);
    page.pageComponents = await page.generatePageComponents();
    return page;
  }

  async generatePageComponents() {
    const authedButton = new AuthedButton(this.pageDriver, {
      authedButton: { selector: '#authed' },
    });

    return { authedButton };
  }

  async waitForNavigation() {
    await this.pageDriver.page.waitForNavigation();
  }

  getUrl() {
    return this.pageDriver.page.url();
  }
}