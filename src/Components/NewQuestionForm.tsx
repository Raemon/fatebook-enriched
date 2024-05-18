import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useSubmitQuestion, SubmitQuestionData, Tag } from '../useFatebook';
import InputWithDropdown from './InputWithDropdown';
import Row from './common/Row';

const useStyles = createUseStyles({
  form: {
    margin: '20px auto',
    borderRadius: '8px',
    maxWidth: '600px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    flexGrow: 1,
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
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  tag: {
    padding: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '4px',
  }
});

const NewQuestionForm = ({apiKey, tags}: {apiKey: string, tags: Tag[]}) => {
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
    console.log(name, value)
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitQuestion(formData);
  };

  const handleEnterTag = (value: string) => {
    setFormData((prevFormData: SubmitQuestionData) => ({...prevFormData, tags: [...prevFormData.tags ?? [], value]}));
  }

  return (
    <div className={classes.form} onSubmit={handleSubmit}>
      <Row justifyContent='space-between' gap="10px">
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
          placeholder="Probability"
          value={formData.forecast}
          onChange={handleChange}
          step="0.01"
          min="0"
          max="1"
        />
        <button className={classes.button} type="submit" disabled={isSubmitting} onClick={handleSubmit}>
          Submit
        </button>
        {submitError && <div className={classes.error}>{submitError.message}</div>}
        {submitSuccess && <div className={classes.error} style={{ color: 'green' }}>Question submitted successfully!</div>}
      </Row>
      <Row>
        <div className={classes.tags}>{formData.tags?.map((tag) => <div>
          {tag}</div>)}
        </div>
        <InputWithDropdown 
          list={tags.map(tag => ({name: tag.name, count: tag.count ?? 1}))}
          placeholder='tags'
          handleEnter={(value) => setFormData((prevFormData: SubmitQuestionData) => ({...prevFormData, tags: [...prevFormData.tags ?? [], value]}))} />
      </Row>
    </div>
  );
};

export default NewQuestionForm;
