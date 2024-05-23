import React from 'react';
import { createUseStyles } from "react-jss";
import { ExtendedForecast } from '../types';
import groupBy from 'lodash/groupBy';
import CalibrationGraph from './CalibrationGraph';
import ForecastsGroupTitle from './ForecastsGroupTitle';

const useStyles = createUseStyles({
  notEnoughData: {
    fontSize: 14,
    color: "gray"
  }
});

const CalibrationByPeriod = ({forecasts}:{forecasts: ExtendedForecast[]}): JSX.Element => {
  const classes = useStyles();

  const forecastsByTimePeriod = groupBy(forecasts, (forecast: ExtendedForecast) => {
    const resolutionTime = new Date(forecast.question.resolveBy).getTime() - new Date(forecast.question.createdAt).getTime()
    const resolutionInDays = Math.floor(resolutionTime / (1000 * 3600 * 24))
    const brackets = [1, 1000]
    if (resolutionInDays === 0) {
      return 1
    }
    return 365
  })
  return (
    <div>
      {Object.keys(forecastsByTimePeriod).map((timePeriod) => {
        const title = `Resolved within ${timePeriod} day${timePeriod === '1' ? '' : 's'}`
        if (forecastsByTimePeriod[timePeriod].length < 50) {
          return <div style={{textAlign:"center"}} key={timePeriod}>
            <ForecastsGroupTitle title={title} forecasts={forecastsByTimePeriod[timePeriod]} />
            <p className={classes.notEnoughData}>Not enough data</p>
          </div>
        }
        return <CalibrationGraph key={timePeriod} forecasts={forecastsByTimePeriod[timePeriod]} title={title} />
      })}
    </div>
  );
};

export default CalibrationByPeriod
