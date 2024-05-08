import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import QuestionItem from './QuestionItem';
import NewQuestionForm from './NewQuestionForm';
import { useFetchQuestions, Question } from '../useFatebook';
import CalibrationGraph from './CalibrationGraph';

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 1200,
    margin: "auto"
  }
});

const graphStyles = createUseStyles({
  graphContainer: {
    width: '100%',
    height: '300px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    padding: '10px'
  },
  bar: {
    height: '100%',
    flexGrow: 1,
    margin: '0 10px',
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#647cff',
    borderRadius: '4px',
    color: 'white',
    padding: '5px 0',
    fontSize: '14px',
    fontWeight: 'bold'
  }
});

const PredictionsList = ({questions}:{questions: Question[]}) => {
  const classes = useStyles();


  const Graph = () => {
    const classes = graphStyles();
  };

  return (
    <div className={classes.root}>
      <h1>Predictions</h1>
      {questions.length === 0 ? <p>No predictions found</p> : null}
      <ul>
        {questions?.map((question: Question) => (
          <QuestionItem key={question.id} question={question} />
        ))}
      </ul>
    </div>
  )
}

export default PredictionsList;
