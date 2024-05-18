import React from 'react';
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100%"
  }
});

const Row = ({children, alignItems="center", justifyContent="flex-start", gap="0px"}:{children: React.ReactNode, alignItems?: "center" | "flex-start" | "flex-end" | "baseline" | "stretch", justifyContent?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "evenly", gap?: string|number}): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={{alignItems, justifyContent, gap}}>
      {children}
    </div>
  );
};

export default Row
