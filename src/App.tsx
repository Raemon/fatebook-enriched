import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import PredictionsList from './Components/PredictionsList';
import { GoogleLogin } from 'react-google-login';
import NewQuestionForm from './Components/NewQuestionForm';
import { useFetchQuestions } from './useFatebook';
import CalibrationGraph from './Components/CalibrationGraph';

const useStyles = createUseStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    padding: 30
  },
  left: {
    width: "40%"
  },
  right: {
    width: "40%"
  },
  apiKey: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh"
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
      <div className={classes.left}>
        <NewQuestionForm apiKey={apiKey} />
        <PredictionsList questions={questions} />
      </div>
      <div className={classes.right}>
        <CalibrationGraph questions={questions} />
      </div>
    </div>
  );
}

export default App;

