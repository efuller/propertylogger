import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import dotenv from 'dotenv';
import { PuppeteerPageDriver } from '../../shared/webDriver/puppeteerPageDriver';
import { WebApp } from '../../shared/webApp/webApp';
import { HomePage } from '../../shared/pages/homePage';
import { LoginButton } from '../../shared/pageComponents/home/loginButton';
import { LoginForm } from '../../shared/pageComponents/home/loginForm';
const feature = loadFeature(
  path.join(__dirname, '../../../../../packages/shared/tests/auth/e2e/auth.feature'),
  { tagFilter: '@web' },
);

dotenv.config({
  path: path.join(__dirname, '../../../../api/.env.test'),
});

defineFeature(feature, (test) => {
  let webApp: WebApp;
  let driver: PuppeteerPageDriver;
  let homePage: HomePage;
  let loginButton: LoginButton;
  let loginForm: LoginForm;

  beforeAll(async () => {
    driver = await PuppeteerPageDriver.create({ headless: false, slowMo: 100 });
    webApp = await WebApp.create(driver);
    homePage = webApp.getPageObject('homePage');
    loginButton = homePage.$('loginButton');
    loginForm = homePage.$('loginForm');
  });

  afterAll(async () => {
    await webApp.close();
  });

  test('successful member creation', ({ given, when, then}) => {
    given('I am a new user', async () => {
      await homePage.navigate();

      expect(await loginButton.isValid()).toBe(true);
      await loginButton.click();
      await homePage.waitForNavigation();
      await loginForm.fillAndSubmitForm();
    });

    when('I am created as a new member', async () => {
      await homePage.waitForNavigation();
      expect(homePage.getUrl()).toContain('creating-account');
      await homePage.waitForNavigation();
      expect(homePage.getUrl()).toContain('logging-in');
    });

    then('I am able to access the app', async () => {
      // we can check for username in header for FE.
      await homePage.waitForNavigation();
      expect(homePage.getUrl()).toContain('dashboard');
    });
  });
});
