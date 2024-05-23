import React, { useState } from 'react';
import { createUseStyles } from "react-jss";
import { ExtendedForecast, Question, Tag } from '../types';
import CalibrationGraph from './CalibrationGraph';
import CalibrationByPeriod from './CalibrationByPeriod';

const useStyles = createUseStyles({
  root: {

  },
  years: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 25,
    gap: 4
  },
  count: {
    fontSize: 11,
    color: "#666"
  },
  tag: {
    border: "solid 1px rgba(0,0,0,.15)",
    borderRadius: 5,
    fontSize: 14,
    cursor: "pointer",
    padding: "5px 10px",
    textAlign: "center",
  },
  year: {
    display: "inline-block",
    border: "solid 1px rgba(0,0,0,.15)",
    borderRadius: 5,
    cursor: "pointer",
    padding: "5px 10px",
    textAlign: "center",
    '&:hover': {
      background: "rgba(0,0,0,.1)"
    }
  },
});

const CalibrationInfo = ({questions, tags}:{questions: Question[], tags: Tag[]}): JSX.Element => {
  const classes = useStyles();

  const forecasts: ExtendedForecast[] = questions.filter(question => question.resolution === 'YES' || question.resolution === 'NO').flatMap(question => question.forecasts.map(forecast => ({
    ...forecast,
    question: question,
    probability: parseFloat(forecast.forecast),
    resolution: question.resolution === 'YES' ? 'YES' : 'NO'
  })))

  const years = Array.from(new Set(forecasts.map(forecast => forecast.createdAt.split("-")[0]))).sort()

  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const filteredForecasts = (selectedYears.length > 0 || selectedTags.length > 0) ? forecasts.filter(forecast => {
    const split = forecast.createdAt.split("-")
    const year = split.length > 0 && split[0]
    const yearFilter = !!selectedYears.length ? year && selectedYears.includes(year) : true
    const tagFilter = selectedTags.length > 0 ? selectedTags.every(selectedTag => forecast.question.tags.map(tag => tag.name).includes(selectedTag)) : true
    return yearFilter && tagFilter
  }) : forecasts


  const handleYearClick = (year: string) => {
    if (selectedYears && selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter(y => y !== year))
    } else {
      setSelectedYears([...selectedYears, year])
    }
  }

  const handleTagClick = (tag: Tag) => {
    if (selectedTags && selectedTags.includes(tag.name)) {
      setSelectedTags(selectedTags.filter(t => t !== tag.name))
    } else {
      setSelectedTags([...selectedTags, tag.name])
    }
  }

  const sortedTags = tags.sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  
  return (
    <div>
      <div className={classes.years}>
        {sortedTags.map(tag => <span key={tag.id} className={classes.tag} onClick={() => handleTagClick(tag)} style={{background: selectedTags.includes(tag.name) ? "#eee" : "unset"}}>
          {tag.name} <span style={{marginLeft: 5}} className={classes.count}>{tag.count}</span>
        </span>)}
      </div>
      <div className={classes.years}>
        {years.map(year => <span key={year} 
          className={classes.year} 
          style={{background: selectedYears.includes(year) ? "#eee" : "unset"}} 
          onClick={() => handleYearClick(year)}
          onDoubleClick={() => setSelectedYears([year])}
          >
          {year} <div className={classes.count}>
            {forecasts.filter(forecast => (!!forecast.createdAt.split("-")?.length) && forecast.createdAt.split("-")[0] === year).length}
          </div>  
        </span>)}
      </div>
      <div>
        <CalibrationGraph forecasts={filteredForecasts} title="All Resolved Questions"/>
      </div>
      <CalibrationByPeriod forecasts={filteredForecasts} />
    </div>
  );
};

export default CalibrationInfo
