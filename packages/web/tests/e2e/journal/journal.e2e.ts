import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import { PuppeteerPageDriver } from '../../shared/webDriver/puppeteerPageDriver';
import { WebApp } from '../../shared/webApp/webApp';
import { HomePage } from '../../shared/pages/homePage';
import { JournalList } from '../../shared/pageComponents/journal/journalList';
import { AddJournalFormComponent } from '../../shared/pageComponents/journal/addJournalForm';

const feature = loadFeature(
  path.join(__dirname, '../../../../../packages/shared/tests/journal/e2e/addJournal.feature'),
  { tagFilter: '@web' },
);

defineFeature(feature, (test) => {
  let webApp: WebApp;
  let driver: PuppeteerPageDriver;
  let homePage: HomePage;
  let addJournalForm: AddJournalFormComponent;
  let journalList: JournalList;

  beforeAll(async () => {
    driver = await PuppeteerPageDriver.create({ headless: true, slowMo: 50 });
    webApp = await WebApp.create(driver);
    homePage = webApp.getPageObject('homePage');
    addJournalForm = homePage.$('addJournalForm');
    journalList = homePage.$('journalList');
  });

  afterAll(async () => {
    await webApp.close();
  });

  test('User creates a new journal', ({ given, and, when, then }) => {
    given('the user is on the homepage page', async () => {
      await homePage.navigate();
    });

    and('the form for adding a new journal is visible', async () => {
      expect(await addJournalForm.isValid()).toBe(true);
    });

    when(/^the user enters a title of (.*) and content of (.*) and clicks the submit button$/, async (title, content) => {
      await addJournalForm.addAndSubmit(title, content);
    });

    then(/^the page should display the title of (.*) and content of (.*)$/, async (title, content) => {
      const firstJournal = await journalList.getFirstJournal();
      expect(firstJournal.title).toBe(title);
      expect(firstJournal.content).toBe(content);
    });
  });
});
