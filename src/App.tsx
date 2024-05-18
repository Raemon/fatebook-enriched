import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import QuestionsList from './Components/QuestionsList';
import NewQuestionForm from './Components/NewQuestionForm';
import { Question, Tag, useFetchQuestions } from './useFatebook';
import CalibrationGraph from './Components/CalibrationGraph';
import countBy from 'lodash/countBy';

const useStyles = createUseStyles({
  root: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    padding: 30,
    fontFamily: `"Inter var", ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
  },
  left: {
    width: "calc(50% - 60px)"
  },
  right: {
    width: "calc(50% - 60px)"
  },
  apiKey: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh"
  }
});

function App() {
  const classes = useStyles();
  const [apiKeyInput, setApiKeyInput] = useState("")
  const [apiKey, setApiKey] = useState(localStorage.getItem('fatebookApiKey') ?? "")
  console.log(localStorage.getItem('fatebookApiKey'))

  const {results, isLoading, error} = useFetchQuestions(apiKey)

  const questions = results?.length > 0 ? results : JSON.parse(localStorage.getItem('questions') || '[]')
  localStorage.setItem('questions', JSON.stringify(questions));
  
  const allTags = questions.flatMap((question: Question) => question.tags)
  const tags = allTags.reduce((acc: Tag[], tag: Tag) => {
    const existingTag = acc.find(t => t.name === tag.name);
    if (existingTag) {
      if (existingTag.count) {
        existingTag.count += 1;
      } else {
        existingTag.count = 1;
      }
    } else {
      acc.push({ ...tag, count: 1 });
    }
    return acc;
  }, []);


  const handleSetApiKey = () => {
    setApiKey(apiKeyInput)
    localStorage.setItem('fatebookApiKey', apiKeyInput)
  }

  if (!apiKey || questions.length === 0) {
    return <div className={classes.apiKey}>
        <h2>Enter your Fatebook API key</h2>
        <p><em>(it'll be stored locally on your machine)</em></p>
        <input type="text" value={apiKeyInput} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKeyInput(e.target.value)} 
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            handleSetApiKey()
          }
        }} />
        <button onClick={() => handleSetApiKey()}>Submit</button>
        <p>You can get your API key from the <a href="https://fatebook.io/api-setup" target="_blank">Fatebook API page</a></p>
        <p>{error?.message}</p>
      </div>
  }

  return (
    <div className={classes.root}>
      <div className={classes.right}>
        <CalibrationGraph questions={questions} tags={tags} />
      </div>
      <div className={classes.left}>
        <NewQuestionForm apiKey={apiKey} tags={tags} />
        <QuestionsList questions={questions} />
      </div>
    </div>
  );
}

export default App;

