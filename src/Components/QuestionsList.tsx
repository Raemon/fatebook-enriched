import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import QuestionItem from './QuestionItem';
import { Question, Tag } from '../types';
import Row from './common/Row';

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 600,
    margin: "auto"
  },
  filters: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    width: "100%",
    marginBottom: 20
  },
  input: {
    border: "none",
    borderBottom: "1px solid #aaa",
    fontSize: 13,
    padding: 5,
    outline: "none"
    
  }
});

const QuestionsList = ({questions, tags}:{questions: Question[], tags: Tag[]}) => {
  const classes = useStyles();
  const [filterTitles, setFilterTitles] = useState("");
  const [filterTags, setFilterTags] = useState("");

  const filteredByTitle = filterTitles ? questions.filter((question) => question.title.toLowerCase().includes(filterTitles.toLowerCase())) : questions;
  const filteredByTags = filterTags ? filteredByTitle.filter((question) => question.tags.some((tag) => tag.name.toLowerCase().includes(filterTags.toLowerCase()))) : filteredByTitle;

  return (
    <div className={classes.root}>
      <h1>Questions</h1>
      <div className={classes.filters}>
        <input className={classes.input} type="text" value={filterTitles} onChange={(e) => setFilterTitles(e.target.value)} placeholder="Filter by question"/>
        <input className={classes.input} type="text" value={filterTags} onChange={(e) => setFilterTags(e.target.value)} placeholder="Filter by tag"/>
      </div>
      {filteredByTags.length === 0 ? <p>No questions found</p> : null}
      {filteredByTags?.map((question: Question, i: number) => {
        if (i === 0) {
          return <QuestionItem key={i} question={question} tags={tags} />
        }
        const prevDate = new Date(questions[i-1].createdAt)

        return <QuestionItem key={i} question={question} prevQuestionDate={prevDate} tags={tags} />
      })}
    </div>
  )
}

export default QuestionsList;
