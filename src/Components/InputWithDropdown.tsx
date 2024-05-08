import React, { useState } from 'react';
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    background: "transparent",
    border: "none",
    fontSize: "16px",
    "&:focus": {
      outline: "none"
    }
  }
});

const InputWithDropdown = ({handleEnter, list, placeholder}:{handleEnter: (value: string) => void, list: {name: string, count: number}[], placeholder?: string}): JSX.Element => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("")
  const filteredSuggestions = list.filter(item => item.name.includes(inputValue)).sort((a, b) => b.count - a.count).slice(0, 10)
  return (
    <>
        <input className={classes.root} value={inputValue} list="suggestions" placeholder={placeholder} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleEnter(inputValue)
          }
        }}/>
        <datalist id="suggestions">
          {filteredSuggestions.map(item => (
            <option key={item.name} value={item.name}>{item.name}</option>
          ))}
        </datalist>
    </>
  );
};

export default InputWithDropdown
