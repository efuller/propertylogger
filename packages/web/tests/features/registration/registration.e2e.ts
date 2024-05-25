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
  let loginButton: LoginButton;
  let acceptButton: AcceptButton;
  let registerForm: RegisterForm;
  let registerLink: RegisterLink;

  beforeAll(async () => {
    driver = await PuppeteerPageDriver.create({ headless: false, slowMo: 100 });
    webApp = await WebApp.create(driver);
    homePage = webApp.getPageObject('homePage');
    loginButton = homePage.$('loginButton');
    acceptButton = homePage.$('acceptButton');
    registerForm = homePage.$('registerForm');
    registerLink = homePage.$('registerLink');
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

      expect(await registerLink.isValid()).toBe(true);
      await registerLink.click();
      await registerForm.fillAndSubmitForm();
    });

    when('I am created as a new member', async () => {
      await homePage.waitForNavigation();
      expect(homePage.getUrl()).toContain('creating-account');
      await acceptButton.click();
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
