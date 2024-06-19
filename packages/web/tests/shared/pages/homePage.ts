import { PuppeteerPageDriver } from '../webDriver/puppeteerPageDriver';
import { BasePage } from './basePage';
import { LoginButton } from '../pageComponents/home/loginButton';
import { LoginForm } from '../pageComponents/home/loginForm';
import { RegisterLink } from '../pageComponents/home/registerLink';
import { RegisterForm } from '../pageComponents/home/registerForm';
import { AcceptButton } from '../pageComponents/home/acceptButton';

type HomepageComponents = {
  acceptButton: AcceptButton;
  loginButton: LoginButton;
  loginForm: LoginForm;
  registerLink: RegisterLink;
  registerForm: RegisterForm;
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
    const acceptButton = new AcceptButton(this.pageDriver, {
      acceptButton: { selector: '[data-action-button-primary]' },
    });
    const loginForm = new LoginForm(this.pageDriver, {
      userName: { selector: '#username' },
      password: { selector: '#password' },
      submitBtn: { selector: '[data-action-button-primary]' },
    });
    const registerLink = new RegisterLink(this.pageDriver, {
      registerLink: { selector: 'div ::-p-text(Sign up)' },
    });
    const registerForm = new RegisterForm(this.pageDriver, {
      userName: { selector: '#email' },
      password: { selector: '#password' },
      submitBtn: { selector: '[data-action-button-primary]' },
    });

    return { loginButton, loginForm, registerLink, registerForm, acceptButton };
  }

  async waitForNavigation() {
    await this.pageDriver.page.waitForNavigation();
  }

  getUrl() {
    return this.pageDriver.page.url();
  }
}