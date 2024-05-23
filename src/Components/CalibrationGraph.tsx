import React from 'react';
import { createUseStyles } from "react-jss";
import { ExtendedForecast, Forecast } from '../types';
import groupBy from 'lodash/groupBy';
import Tooltip from './common/Tooltip';
import ForecastsGroupTitle from './ForecastsGroupTitle';

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 50
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
    zIndex: 1,
  },

});

const CalibrationGraph = ({forecasts, title}:{forecasts: ExtendedForecast[], title: string}): JSX.Element => {
  const classes = useStyles();

  const calibrationByProbability: Record<string, any> = {}
  const calibrationByDecileProbability: Record<string, any> = {}


  const forecastsByProbability = groupBy(forecasts, (forecast: Forecast) => forecast.probability ? Math.round(forecast.probability * 100) : 0)
  const forecastsByDecileProbability = groupBy(forecasts, (forecast: Forecast) => forecast.probability ? Math.round(forecast.probability * 10) : 0)

  Object.keys(forecastsByProbability).forEach((probability: string) => {
    const resolved = forecastsByProbability[probability]
    const yeses = resolved.filter(forecast => forecast.resolution === "YES")
    const result = yeses?.length && resolved?.length ? Math.round(yeses.length / resolved.length * 100) : 0
    calibrationByProbability[probability] = {
      result,
      count: resolved.length, 
      density: resolved.length / 30,
      forecasts: resolved
    }
  }) 
  Object.keys(forecastsByDecileProbability).forEach(probability => {
    const resolvedByDecile = forecastsByDecileProbability[probability]
    const yesesByDecile = resolvedByDecile.filter(forecast => forecast.resolution === "YES")
    const resultByDecile = yesesByDecile?.length && resolvedByDecile?.length ? Math.round(yesesByDecile.length / resolvedByDecile.length * 100) : 0
    calibrationByDecileProbability[probability] = {
      result: resultByDecile,
      count: resolvedByDecile.length, 
      density: resolvedByDecile.length / 30,
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
      <ForecastsGroupTitle title={title} forecasts={forecasts} />
      <div className={classes.graph}>
        {probabilities.map(probability => {
          const bottom = `${calibrationByProbability[probability].result}%`;
          const left = `${probability}%`;
          return (
              <span key={probability} style={{position: "absolute", bottom, left}} title={`forecast: ${probability}%, result: ${calibrationByProbability[probability].result}%, count: ${calibrationByProbability[probability].count}`}
              >
                <Tooltip tooltip={`forecast: ${probability}%, result: ${calibrationByProbability[probability].result}%, count: ${calibrationByProbability[probability].count}`}>
                  <span className={classes.smallDot} style={{ background: `rgba(0,0,0, ${4*calibrationByProbability[probability].density})`}}/>
                </Tooltip>
            </span>
          );
        })}
        {decileProbabilities.map(probability => {
          const bottom = `${calibrationByDecileProbability[probability].result}%`;
          const left = `${parseFloat(probability)*10}%`;
          return (
              <span key={probability + title} style={{ bottom, left, position: "absolute"}}>
                <Tooltip tooltip={`forecast: ${probability}0%, result: ${calibrationByDecileProbability[probability].result}%, count: ${calibrationByDecileProbability[probability].count}`}>
                  <span className={classes.bigDot} style={{ background: `rgba(100,0,200, ${calibrationByDecileProbability[probability].density})`}}/>
                </Tooltip>
              </span>
          );
        })}
        <svg style={{position: "absolute", width: "100%", height: "100%", top: 0, left: 0}}>
          <line x1="0" y1="100%" x2="100%" y2="0" stroke="rgba(0,0,0,.2)" strokeWidth="1" />
        </svg>
        {grid.map(i => <span key={title + i} style={{height: "100%", borderLeft: `1px solid ${gridColor(i)}`, position: "absolute", left: `${i*10}%`}}/>)}
        {grid.map(i => <span key={title + i} style={{color: "#444", position: "absolute", fontSize: 10, textAlign: "right", width: 30, left: -34, bottom: `${i*10 - 1.5}%`}}>{i*10}%</span>)}
        {grid.map(i => <span key={title + i} style={{width: "100%", borderTop: `1px solid ${gridColor(i)}`, position: "absolute", bottom: `${i*10}%`}}/>)} 
        {grid.map(i => <span key={title + i} style={{color: "#444", position: "absolute", fontSize: 10, textAlign: "center", bottom: -22, left: `${i*10}%`}}>{i*10}%</span>)}

      </div>
    </div>
  );
};

export default CalibrationGraph
