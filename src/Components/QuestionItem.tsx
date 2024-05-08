import React from 'react';
import { createUseStyles } from 'react-jss';
import { Question } from '../useFatebook';

const questionItemStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'top',
    gap: '50px',
    borderBottom: "1px solid #dedede",
    marginBottom: 25
  },
  questionContainer: {
    width: "50%",
    padding: '5px',
    margin: '5px',
    fontSize: '0.8rem',
    '& h4': {
      fontSize: 14,
      margin: '0',
      marginBottom: 10,
      fontWeight: 500
    }
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '10px',
    fontSize: 12,
    color: 'gray'
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: '50%'
  },
  forecastContainer: {
    width: "50%",
    padding: '5px',
    margin: '5px',
    fontSize: '0.8rem'
  }
});

interface QuestionItemProps {
  question: Question;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  const classes = questionItemStyles();

  return (
    <div className={classes.root} onClick={() => console.log(question)}>
      <div className={classes.questionContainer}>
        <h4>{question.title}</h4>
        <div className={classes.details}>
          <span>{new Date(question.createdAt).toLocaleDateString()}</span>
          <span>Resolved: {question.resolved ? "Yes" : "No"}</span>
          {question.resolution && <span>Resolution: {question.resolution}</span>}
          {/* {question.user && (
            <div>
              <img src={question.user.image} alt={question.user.name} className={classes.userImage} />
              <span>Posted by: {question.user.name}</span>
            </div>
          )} */}
        </div>
        <div className={classes.forecastContainer}>
        {question.forecasts.map(forecast => (
            <div key={forecast.id}>
              <span>Outcome: {forecast.outcome}</span>
              <span>Probability: {forecast.probability}%</span>
            </div>
          ))}
      </div>
        {question.comments.map(comment => <div>{comment.comment}</div>)}
      </div>

    </div>
  );
};

export default QuestionItem;

