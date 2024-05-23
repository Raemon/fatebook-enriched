import React from 'react';
import { createUseStyles } from "react-jss";
import { ExtendedForecast } from '../types';

const useStyles = createUseStyles({
  root: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 15,
    marginTop: 35
  },
});

const ForecastsGroupTitle = ({title, forecasts}:{title: string, forecasts: ExtendedForecast[]}): JSX.Element => {
  const classes = useStyles();
  const percentYes = Math.round( forecasts.filter(f => f.resolution === 'YES').length / forecasts.length * 100)
  return (
    <h3 className={classes.root}>
      {title} ({forecasts.length}, {percentYes}%)
    </h3>
  );
};

export default ForecastsGroupTitle
