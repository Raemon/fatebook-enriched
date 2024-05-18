import React from 'react';
import { createUseStyles } from 'react-jss';
import { Question } from '../useFatebook';
import classNames from 'classnames';

const questionItemStyles = createUseStyles({
  root: {
    padding: 10,
    width: '100%',
    borderBottom: "1px solid #dedede",
  },
  main: {
    display: 'flex',
    alignItems: "center",
    gap: 10,
    fontSize: '0.8rem',
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 6,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: '50%'
  },
  forecastContainer: {
    display: 'flex',
    gap: '5px'
  },
  resolution: {
    fontSize: 12,
    padding: '2px 4px',
    borderRadius: 3,
  },
  YES: {
    color: 'green'
  },
  NO: {
    color: 'red'
  },
  AMBIGUOUS: {
    color: 'orange'
  },
  forecast: {
    fontSize: 11,
  }
});

interface QuestionItemProps {
  question: Question;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  const classes = questionItemStyles();

  let resolutionPhrase = "Unresolved";
  let resolutionColor = 'rgba(0, 0, 0, 0.1)';
  switch (question.resolution) {
    case 'AMBIGUOUS':
      resolutionPhrase = "UNCLEAR";
      resolutionColor = 'rgba(255, 165, 0, 0.2)';
      break;
    case 'YES':
      resolutionPhrase = "YES";
      resolutionColor = 'rgba(0, 128, 0, 0.2)';
      break;
    case 'NO':
      resolutionPhrase = "NO";
      resolutionColor = 'rgba(255, 0, 0, 0.2)';
      break;
  }


  return (
    <div className={classes.root} onClick={() => console.log(question)}>
      <div className={classes.title}>{question.title}</div>
      <div className={classes.main}>
        <span className={classes.resolution} style={{background: resolutionColor}}>
          {resolutionPhrase}
        </span>
        {question.forecasts.map(forecast => (
            <span className={classes.forecast} key={forecast.id}>{forecast.forecast ? parseFloat(forecast.forecast)*100+"%" : ""}</span>
        ))}
      </div>
      {question.comments.map(comment => <div>{comment.comment}</div>)}
    </div>
  );
};

export default QuestionItem;

