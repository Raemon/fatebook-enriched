import React from 'react';
import { createUseStyles } from 'react-jss';
import { Question, Tag } from '../types';
import classNames from 'classnames';
import InputWithDropdown from './InputWithDropdown';

const questionItemStyles = createUseStyles({
  root: {
    width: '100%',
    marginBottom: 2,
  },
  question: {
    background: "#fff",
    borderBottom: '1px solid #ddd',
    padding: 10,
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
    fontSize: 13,
    padding: '4px 6px',
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
    fontSize: 13,
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5
  },
  tag: {
    padding: '4px 6px',
    borderRadius: 3,
    background: '#eee',
    fontSize: 13,
  },
  comment: {
    fontSize: 13,
    marginTop: 12,
    color: 'gray'
  },
  createdAt: {
    marginLeft: 'auto',
    fontSize: 11,
    color: 'gray'
  },
  prevQuestionDate: {
    marginTop: 12
  }
});

interface QuestionItemProps {
  question: Question;
  prevQuestionDate?: Date;
  tags: Tag[];
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, prevQuestionDate, tags }) => {
  const classes = questionItemStyles();

  let resolutionPhrase = "Unresolved";
  let resolutionColor = 'rgba(173, 216, 230, 0.2)'; // light blue with some transparency
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

  const createdAt = question.createdAt.split("T")[0];
  const prevAt = prevQuestionDate?.toISOString().split("T")[0];
  console.log(question.title)
  console.log(prevAt, createdAt, prevAt === createdAt)

  const handleEnter = (value: string) => {
    console.log(value)
  }
  const handleDelete = (value: string) => {
    console.log(value)
  }
  const list = tags.map(tag => tag.name)

  return (
    <div className={classes.root}>
      {/* {!prevAt || (prevAt !== createdAt) && <div className={classes.prevQuestionDate}></div>} */}
      <div className={classes.question} onClick={() => console.log(question)}>
        <div className={classes.title}>{question.title}</div>
        <div className={classes.main}>
          <span className={classes.resolution} style={{background: resolutionColor}}>
            {resolutionPhrase}
          </span>
          {question.forecasts.map(forecast => (
              <span className={classes.forecast} key={forecast.id}>{forecast.forecast ? parseFloat(forecast.forecast)*100+"%" : ""}</span>
          ))}
          <div className={classes.tags}>
            {question.tags.map(tag => <span className={classes.tag} key={tag.id}>{tag.name}</span>)}
            {/* <InputWithDropdown handleEnter={handleEnter} handleDelete={handleDelete} list={list} placeholder="Add tag" /> */}
          </div>
          <div className={classes.createdAt}>
            {createdAt}
          </div>
        </div>
        {question.comments.map(comment => <div key={comment.id} className={classes.comment}>{comment.comment}</div>)}
      </div>
    </div>
  );
};

export default QuestionItem;

