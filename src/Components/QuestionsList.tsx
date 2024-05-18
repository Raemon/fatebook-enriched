import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import QuestionItem from './QuestionItem';
import { Question } from '../useFatebook';

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 600,
    margin: "auto"
  }
});

const QuestionsList = ({questions}:{questions: Question[]}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h1>Questions</h1>
      {questions.length === 0 ? <p>No predictions found</p> : null}
      {questions?.map((question: Question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
    </div>
  )
}

export default QuestionsList;
