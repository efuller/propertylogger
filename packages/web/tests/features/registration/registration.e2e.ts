import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import dotenv from 'dotenv';
import { PuppeteerPageDriver } from '../../shared/webDriver/puppeteerPageDriver';
import { WebApp } from '../../shared/webApp/webApp';
import { HomePage } from '../../shared/pages/homePage';
import { LoginButton } from '../../shared/pageComponents/home/loginButton';
import { RegisterLink } from '../../shared/pageComponents/home/registerLink';
import { RegisterForm } from '../../shared/pageComponents/home/registerForm';
import { AcceptButton } from '../../shared/pageComponents/home/acceptButton';
import { AuthedButton } from '../../shared/pageComponents/dashboard/authedButton';
import { DashboardPage } from '../../shared/pages/dashboardPage';

const feature = loadFeature(
  path.join(__dirname, '../../../../../packages/shared/tests/features/registration.feature'),
  { tagFilter: '@web' },
);

dotenv.config({
  path: path.join(__dirname, '../../../../api/.env.test'),
});

defineFeature(feature, (test) => {
  let webApp: WebApp;
  let driver: PuppeteerPageDriver;
  let homePage: HomePage;
  let dashboard: DashboardPage;
  let loginButton: LoginButton;
  let acceptButton: AcceptButton;
  let registerForm: RegisterForm;
  let registerLink: RegisterLink;
  let authedButton: AuthedButton;

  beforeAll(async () => {
    driver = await PuppeteerPageDriver.create({ headless: false, slowMo: 75 });
    webApp = await WebApp.create(driver);
    homePage = webApp.getPageObject('homePage');
    dashboard = webApp.getPageObject('dashboard');
    loginButton = homePage.$('loginButton');
    acceptButton = homePage.$('acceptButton');
    registerForm = homePage.$('registerForm');
    registerLink = homePage.$('registerLink');
    authedButton = dashboard.$('authedButton');
  });

  afterAll(async () => {
    await webApp.close();
  });

  test('Successful member creation', ({ given, when, then, and}) => {
    given('I have registered as a new user', async () => {
      await homePage.navigate();

      expect(await loginButton.isValid()).toBe(true);
      await loginButton.click();
      await homePage.waitForNavigation();

      expect(await registerLink.isValid()).toBe(true);
      await registerLink.click();
      await registerForm.fillAndSubmitForm();

      await homePage.waitForNavigation();
      await acceptButton.click();
    });

    when('I am redirected to the logging in page', async () => {
      await homePage.waitForNavigation();
      expect(homePage.getUrl()).toContain('logging-in');
    });

    then('I am redirected to the dashboard', async () => {
      await homePage.waitForNavigation();
      expect(homePage.getUrl()).toContain('dashboard');
    });

    and('My member email is present on the page', async () => {
      // we can check for username in header for FE.
      expect(await authedButton.isValid()).toBe(true);
      expect(await authedButton.getText()).toBe('admin@test.com');
    });
  });
});
