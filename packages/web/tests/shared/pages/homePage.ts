import { PuppeteerPageDriver } from '../webDriver/puppeteerPageDriver';
import { BasePage } from './basePage';
import { LoginButton } from '../pageComponents/home/loginButton';
import { LoginForm } from '../pageComponents/home/loginForm';

type HomepageComponents = {
  loginButton: LoginButton;
  loginForm: LoginForm;
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
    const loginButton = new LoginButton(this.pageDriver, {
      loginButton: { selector: '#login' },
    });
    const loginForm = new LoginForm(this.pageDriver, {
      userName: { selector: '#username' },
      password: { selector: '#password' },
      submitBtn: { selector: '[data-action-button-primary]' },
    });

    return { loginButton, loginForm };
  }

  async waitForNavigation() {
    await this.pageDriver.page.waitForNavigation();
  }

  getUrl() {
    return this.pageDriver.page.url();
  }
}