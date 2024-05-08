import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useSubmitQuestion, SubmitQuestionData } from '../useFatebook';
import TagInput from './InputWithDropdown';
import InputWithDropdown from './InputWithDropdown';

const useStyles = createUseStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '500px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  },
});

const NewQuestionForm = ({apiKey}: {apiKey: string}) => {
  const classes = useStyles();
  const { submitQuestion, isSubmitting, submitError, submitSuccess } = useSubmitQuestion(apiKey);
  const [formData, setFormData] = useState<SubmitQuestionData>({
    title: '',
    description: '',
    resolveBy: '',
    forecast: undefined,
    tags: [],
    sharePublicly: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitQuestion(formData);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <input
        className={classes.input}
        type="text"
        name="title"
        placeholder="Question Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        className={classes.input}
        type="number"
        name="forecast"
        placeholder="Forecast Probability"
        value={formData.forecast}
        onChange={handleChange}
        step="0.01"
        min="0"
        max="1"
      />
      <InputWithDropdown 
        list={[{name: "apple", count: 1}, {name: "banana", count: 2}]}
        placeholder='tags'
        handleEnter={(value) => setFormData((prevFormData: SubmitQuestionData) => ({...prevFormData, tags: [...prevFormData.tags ?? [], value]}))} />
      <button className={classes.button} type="submit" disabled={isSubmitting}>
        Submit Question
      </button>
      {submitError && <div className={classes.error}>{submitError.message}</div>}
      {submitSuccess && <div className={classes.error} style={{ color: 'green' }}>Question submitted successfully!</div>}
    </form>
  );
};

export default NewQuestionForm;
