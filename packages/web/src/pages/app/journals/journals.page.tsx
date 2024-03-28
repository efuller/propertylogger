import React, { useEffect } from 'react';
import { AddJournalForm } from './components/addJournal.form.tsx';
import { Journal } from '../../../modules/jounals/journal.model.ts';
import { JournalPresenter } from '../../../modules/jounals/journal.presenter.ts';
import { JournalController } from '../../../modules/jounals/journal.controller.ts';
import { observer } from 'mobx-react';

interface JournalsPageProps {
  presenter: JournalPresenter;
  controller: JournalController;
}

export const JournalsPage = observer(({ presenter, controller }: JournalsPageProps) => {
  const handleOnSubmit = async (newJournal: Journal) => {
    await controller.createJournal(newJournal);
  };

  useEffect(() => {
    presenter.getJournals();
  }, [presenter]);

  return (
    <div>
      <h1>Add Journal</h1>
      <AddJournalForm onSubmit={handleOnSubmit} />
      <hr />
      {
        presenter.viewModel && presenter.viewModel.journals.length === 0 ? (
          <p>No journals found</p>
        ) : (
          <div>
            <h1>Journal List</h1>
            <ul id="journal-list">
              {presenter.viewModel.journals.map((journal, i) => {
                {
                  return journal.title && journal.content ? (
                    <li
                      key={i}
                      className="journal-entry"
                    >
                      <h3 className="journal-title">{journal.title}</h3>
                      <p className="journal-content">{journal.content}</p>
                    </li>
                  ) : null;
                }
              })}
            </ul>
          </div>
        )
      }
    </div>
  );
});
