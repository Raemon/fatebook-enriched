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

const InputWithDropdown = ({handleEnter, handleDelete, list, placeholder}:{handleEnter: (value: string) => void, handleDelete?: (value?: string) => void, list: {name: string, count: number}[], placeholder?: string}): JSX.Element => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("")
  const filteredSuggestions = list.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase())).sort((a, b) => b.count - a.count).slice(0, 10)
  return (
    <>
        <input 
          className={classes.root} 
          value={inputValue} 
          list="suggestions" 
          placeholder={placeholder} 
          onInput={(e) => {
            const inputElement = e.target as HTMLInputElement;
            setInputValue(inputElement.value)
          }}
          onChange={(e) => {
            // Check if the current value matches one of the suggestions exactly
            const match = filteredSuggestions.find(item => item.name === e.target.value);
            if (match) {
              handleEnter(e.target.value);
              setInputValue("");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleEnter(inputValue);
              setInputValue("");
            }
            if (e.key === "Delete" || e.key === "Backspace") {
              handleDelete && handleDelete();
            }
          }}
        />
        <datalist id="suggestions">
          {filteredSuggestions.map(item => (
            <option 
              key={item.name} value={item.name} 
              onClick={() => { console.log("ASEF"); handleEnter(inputValue); setInputValue(""); }}
            >
              {item.name}
            </option>
          ))}
        </datalist>
    </>
  );
};

export default InputWithDropdown
