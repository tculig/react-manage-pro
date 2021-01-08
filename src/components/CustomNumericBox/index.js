import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export function CustomNumericBox(props) {
  const { defaultValue, min, max, options } = props;
  const [state, setState] = useState({
    value: defaultValue,
  });

  const [optionsState, setOptions] = useState({
    options: [
      <option value={defaultValue} key={defaultValue}>
        {defaultValue}
      </option>,
    ],
    min,
    max,
  });

  useEffect(() => {
    if (options && options.length > 0) {
      setOptions({
        ...optionsState,
        options,
      });
    }
  }, [options]);

  useEffect(() => {
    if (defaultValue) {
      setState({
        ...state,
        value: defaultValue,
      });
    }
  }, [defaultValue]);

  function increment() {
    setState({
      ...state,
      value: Math.min(state.value + 1, optionsState.max),
    });
  }
  function decrement() {
    setState({
      ...state,
      value: Math.max(state.value - 1, optionsState.min),
    });
  }

  function change(event) {
    setState({
      ...state,
      value: parseInt(event.target.value, 10),
    });
  }
  useEffect(() => {
    if (state.value) props.updateParent(state.value);
  }, [state.value]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        border: "0px solid red",
        margin: "4px",
        height: "36px",
      }}
    >
      <select
        style={{ outline: "none", margin: "0px" }}
        onChange={change}
        value={state.value}
      >
        {optionsState.options}
      </select>
      <div style={{ display: "flex", flexDirection: "column", margin: "0px" }}>
        <FontAwesomeIcon
          icon={faCaretUp}
          onClick={increment}
          style={{
            border: "1px solid black",
            height: "18px",
            width: "16px",
            paddingLeft: "1px",
            paddingRight: "1px",
          }}
        />
        <FontAwesomeIcon
          icon={faCaretDown}
          onClick={decrement}
          style={{
            border: "1px solid black",
            height: "18px",
            width: "16px",
            paddingLeft: "1px",
            paddingRight: "1px",
          }}
        />
      </div>
    </div>
  );
}

CustomNumericBox.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

CustomNumericBox.defaultProps = {
  min: 4,
  max: 72,
};
