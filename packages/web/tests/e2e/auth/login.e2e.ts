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
    driver = await PuppeteerPageDriver.create({ headless: false, slowMo: 200 });
    webApp = await WebApp.create(driver);
    homePage = webApp.getPageObject('homePage');
    loginButton = homePage.$('loginButton');
    loginForm = homePage.$('loginForm');
  });

  afterAll(async () => {
    await webApp.close();
  });

  test('A registered member can login and access their dashboard', ({ given, when, then}) => {
    given('I am on the homepage', async () => {
      await homePage.navigate();
    });

    when('I login', async () => {
      expect(await loginButton.isValid()).toBe(true);
      await loginButton.click();
      await homePage.waitForNavigation();
      await loginForm.fillAndSubmitForm();
    });

    then('I am redirected to my dashboard', async () => {
      await homePage.waitForNavigation();
      await homePage.waitForNavigation();
      expect(homePage.getUrl()).toContain('dashboard');
    });
  });
});
