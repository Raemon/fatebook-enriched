import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useSubmitQuestion } from '../useFatebook';
import { Tag, SubmitQuestionData, Question } from '../types';
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
  tagsEditor: {
    marginTop: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  tag: {
    padding: '5px 8px',
    background: '#eee',
    fontSize: '14px',
    borderRadius: '4px',
    marginBottom: '5px',
    marginRight: 6,
  }
});

const NewQuestionForm = ({apiKey, tags, latestQuestion, fetchQuestions}: {apiKey: string, tags: Tag[], latestQuestion: Question, fetchQuestions: () => void}) => {
  const classes = useStyles();
  const { submitQuestion, isSubmitting } = useSubmitQuestion(apiKey);

  const latestQuestionTwoDaysOld = latestQuestion.resolveBy && new Date(latestQuestion.resolveBy) < new Date(new Date().setDate(new Date().getDate() - 2));
  const defaultTags = latestQuestionTwoDaysOld ? [] : latestQuestion.tags?.map(tag => tag.name) ?? [];

  const [formData, setFormData] = useState<SubmitQuestionData>({
    title: '',
    description: '',
    resolveBy: '',
    forecast: undefined,
    tags: defaultTags,
    sharePublicly: false,
  });
  console.log(latestQuestion)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitQuestion(formData);
    fetchQuestions();
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
      </Row>
      <div className={classes.tagsEditor}>
        <div className={classes.tags}>{formData.tags?.map((tag) => <div className={classes.tag}>
          {tag}</div>)}
        </div>
        <InputWithDropdown 
          list={tags.map(tag => ({name: tag.name, count: tag.count ?? 1}))}
          placeholder='tags'
          handleEnter={(value) => setFormData((prevFormData: SubmitQuestionData) => ({...prevFormData, tags: Array.from(new Set([...prevFormData.tags ?? [], value]))}))} 
          handleDelete={() => { setFormData((prevFormData: SubmitQuestionData) => ({...prevFormData, tags: prevFormData.tags?.slice(0, -1)}))}}
        />
      </div>
    </div>
  );
};

export default NewQuestionForm;
