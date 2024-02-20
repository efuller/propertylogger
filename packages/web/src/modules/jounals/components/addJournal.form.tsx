import React, { useRef } from 'react';
import { Journal } from '../journals.page';

type Props = {
  onSubmit: (data: Journal) => void;
}

export const AddJournalForm = ({ onSubmit }: Props) => {
  const formRef = useRef(null);
  const [formData, setFormData] = React.useState<Journal>({
    title: '',
    content: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit(formData);
    setFormData({ title: '', content: '' });
  };

  return (
    <form
      id="add-journal"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <input
        id="title"
        type="text"
        name="title"
        value={formData.title}
        placeholder="Title"
        onChange={(e) => {
          setFormData({
            ...formData,
            title: e.target.value,
          });
        }}
      />
      <input
        id="content"
        type="text"
        name="content"
        value={formData.content}
        placeholder="Content"
        onChange={(e) => {
          setFormData({
            ...formData,
            content: e.target.value,
          });
        }}
      />
      <button
        id="submit"
        type="submit"
      >
        Add Journal
      </button>
    </form>
  );
};
