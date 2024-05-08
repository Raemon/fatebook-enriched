import React, { useState } from 'react';
import { createUseStyles } from "react-jss";
import { Forecast, Question } from '../useFatebook';
import groupBy from 'lodash/groupBy';

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  graph: { width: 400, height: 400, position: "relative" },
  smallDot: { 
    width: 5, height: 5, 
    borderRadius: "50%", border: "solid 1px rgba(0,0,0,.3)", 
    position: 'absolute', transform: `translate(-50%, 50%)`,
    zIndex: 2
  },
  bigDot: { 
    width: 15, height: 15, 
    borderRadius: "50%", position: 'absolute', border: "solid 1px rgba(0,0,0,.3)", 
    transform: `translate(-50%, 50%)`,
    zIndex: 1
  },
  years: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    maxWidth: 600,
    marginBottom: 25,
    gap: 4
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
  count: {
    fontSize: 11,
    color: "#666"
  }
});

const CalibrationGraph = ({questions}:{questions: Question[]}): JSX.Element => {
  const classes = useStyles();

  const forecasts = questions.flatMap(question => question.forecasts.map(forecast => ({
    ...forecast,
    question: question,
    probability: parseFloat(forecast.forecast),
    resolution: question.resolution
  })))
  const years = Array.from(new Set(forecasts.map(forecast => forecast.createdAt.split("-")[0]))).sort()

  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const filteredForecasts = (selectedYears.length > 0) ? forecasts.filter(forecast => selectedYears.includes(forecast.createdAt.split("-")[0])) : forecasts

  const allTags = questions.flatMap((question) => question.tags)
  const tagsByName = groupBy(allTags, (tag) => tag.name)

  const handleYearClick = (year: string) => {
    if (selectedYears && selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter(y => y !== year))
    } else {
      setSelectedYears([...selectedYears, year])
    }
  }


  const forecastsByProbability = groupBy(filteredForecasts, (forecast: Forecast) => forecast.probability ? Math.round(forecast.probability * 100) : 0)
  const forecastsByDecileProbability = groupBy(filteredForecasts, (forecast: Forecast) => forecast.probability ? Math.round(forecast.probability * 10) : 0)

  const calibrationByProbability: Record<string, any> = {}
  const calibrationByDecileProbability: Record<string, any> = {}

  const maxCount = Math.max(...Object.values(forecastsByProbability).map(forecasts => forecasts.length))

  Object.keys(forecastsByProbability).forEach((probability: string) => {
    const resolved = forecastsByProbability[probability].filter(forecast => forecast.resolution && forecast.resolution !== "AMBIGUOUS")
    const yeses = resolved.filter(forecast => forecast.resolution === "YES")
    const result = yeses?.length && resolved?.length ? Math.round(yeses.length / resolved.length * 100) : 0
    calibrationByProbability[probability] = {
      result,
      count: resolved.length, 
      density: resolved.length / maxCount,
      forecasts: resolved
    }
  }) 
  Object.keys(forecastsByDecileProbability).forEach(probability => {
    const resolvedByDecile = forecastsByDecileProbability[probability].filter(forecast => forecast.resolution && forecast.resolution !== "AMBIGUOUS")
    const yesesByDecile = resolvedByDecile.filter(forecast => forecast.resolution === "YES")
    const resultByDecile = yesesByDecile?.length && resolvedByDecile?.length ? Math.round(yesesByDecile.length / resolvedByDecile.length * 100) : 0
    calibrationByDecileProbability[probability] = {
      result: resultByDecile,
      count: resolvedByDecile.length, 
      density: resolvedByDecile.length / maxCount,
      forecasts: resolvedByDecile,
    }
  })

  const probabilities = Object.keys(calibrationByProbability).sort((a, b) => parseFloat(a) - parseFloat(b))
  const decileProbabilities = Object.keys(calibrationByDecileProbability).sort((a, b) => parseFloat(a) - parseFloat(b))
  const grid = Array.from({ length: 11 }, (_, i) => i);

  const gridColor = (i: number) => {
    const opacity = i === 5 ? .5 : 0.15
    return `rgba(0,0,0, ${opacity})`
  }

  return (
    <div className={classes.root}>
      <div className={classes.years}>
        {Object.keys(tagsByName).map(tag => <span key={tag} className={classes.tag}>
          {tag} <span style={{marginLeft: 5}} className={classes.count}>{tagsByName[tag].length}</span>
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
            {forecasts.filter(forecast => forecast.createdAt.split("-")[0] === year).length}
          </div>  
        </span>)}
      </div>
      <div className={classes.graph}>
        {probabilities.map(probability => {
          const bottom = `${calibrationByProbability[probability].result}%`;
          const left = `${probability}%`;
          return (
            <span key={probability} className={classes.smallDot} title={`forecast: ${probability}%, result: ${calibrationByProbability[probability].result}%, count: ${calibrationByProbability[probability].count}`}
              style={{
                bottom, 
                left,  
                background: `rgba(0,0,0, ${4*calibrationByProbability[probability].density})`
              }}
            />
          );
        })}
        {decileProbabilities.map(probability => {
          const bottom = `${calibrationByDecileProbability[probability].result}%`;
          const left = `${parseFloat(probability)*10}%`;
          return (
            <span key={probability} className={classes.bigDot} title={`forecast: ${probability}0%, result: ${calibrationByDecileProbability[probability].result}%, count: ${calibrationByDecileProbability[probability].count}`}
              style={{
                bottom, 
                left,  
                background: `rgba(100,0,200, ${calibrationByDecileProbability[probability].density})`
              }}
            />
          );
        })}
        <svg style={{position: "absolute", width: "100%", height: "100%", top: 0, left: 0}}>
          <line x1="0" y1="100%" x2="100%" y2="0" stroke="rgba(0,0,0,.2)" strokeWidth="1" />
        </svg>
        {grid.map(i => <span key={i} style={{height: "100%", borderLeft: `1px solid ${gridColor(i)}`, position: "absolute", left: `${i*10}%`}}/>)}
        {grid.map(i => <span key={i} style={{color: "#444", position: "absolute", fontSize: 10, textAlign: "right", width: 30, left: -34, bottom: `${i*10 - 1.5}%`}}>{i*10}%</span>)}
        {grid.map(i => <span key={i} style={{width: "100%", borderTop: `1px solid ${gridColor(i)}`, position: "absolute", bottom: `${i*10}%`}}/>)} 
        {grid.map(i => <span key={i} style={{color: "#444", position: "absolute", fontSize: 10, textAlign: "center", bottom: -22, left: `${i*10}%`}}>{i*10}%</span>)}

      </div>
    </div>
  );
};

export default CalibrationGraph
