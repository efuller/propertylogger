import React, { useEffect } from 'react';
import { AddJournalForm } from './components/addJournal.form';
import { ApiClient } from '../../shared/apiClient/apiClient';
import { SignInButton, SignOutButton, useAuth, useUser } from '@clerk/clerk-react';

export interface Journal {
  title: string;
  content: string;
}

let baseUrl = 'http://localhost:3000';

if (process.env.NODE_ENV === 'production') {
  baseUrl = import.meta.env.VITE_API_URL as string;
} else if (process.env.NODE_ENV === 'test') {
  baseUrl = 'http://localhost:3001';
}

const apiClient = new ApiClient(baseUrl);

export const JournalsPage = () => {
  const { getToken } = useAuth();
  const { isSignedIn, isLoaded } = useUser();
  const [journals, setJournals] = React.useState<Journal[]>([]);


  const handleOnSubmit = async (newJournal: Journal) => {
    const token = await getToken();
    await apiClient.post('/journal', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: newJournal
    });
    setJournals([...journals, newJournal]);
  };

  useEffect(() => {
    if (!isSignedIn) return;
    const fetchJournals = async () => {
      const token = await getToken();
      const response = await apiClient.get<Journal[]>(
        '/journal',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.success && response.data) {
        setJournals([...response.data]);
      }
    };
    fetchJournals();
  }, [getToken, isSignedIn]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div>
        <h1>Welcome to PropertyLogger</h1>
        <SignInButton />
      </div>
    );
  }

  return (
    <div>
      <SignOutButton signOutCallback={() => {
        window.location.href = '/'
      }} />
      <h1>Add Journal</h1>
      <AddJournalForm onSubmit={handleOnSubmit} />
      <hr />
      <div>
        <h1>Journal List</h1>
        <ul id="journal-list">
          {journals.map((journal, i) => {
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
    </div>
  );
};
