import React, { useEffect } from 'react';
import { AddJournalForm } from './components/addJournal.form';
import { ApiClient } from '../../shared/apiClient/apiClient';
import { useAuth0 } from '@auth0/auth0-react';

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
  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    logout
  } = useAuth0();
  const [journals, setJournals] = React.useState<Journal[]>([]);

  const handleOnSubmit = async (newJournal: Journal) => {
    await apiClient.post('/journal', newJournal);
    setJournals([...journals, newJournal]);
  };

  useEffect(() => {
    const fetchJournals = async () => {
      const token = await getAccessTokenSilently();
      console.log('token', token);
      const response = await apiClient.get<Journal[]>('/journal');
      if (response.success && response.data) {
        setJournals([...response.data]);
      }
    };
    fetchJournals();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Welcome to the Journal App</h1>
        <button onClick={() => loginWithRedirect()}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}>
        Logout
      </button>
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
