import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
});

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1>Test App</h1>
    </div>
  );
}

export default App;
