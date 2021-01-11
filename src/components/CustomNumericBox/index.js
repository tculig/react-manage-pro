import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export default function CustomNumericBox(props) {
  const { value, min, max, options, onChange } = props;

  function increment() {
    onChange({
      value: Math.min(value + 1, max),
    });
  }
  function decrement() {
    onChange({
      value: Math.max(value - 1, min),
    });
  }

  function change(event) {
    onChange({
      value: parseInt(event.target.value, 10),
    });
  }

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
        value={value}
      >
        {options}
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
  value: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

CustomNumericBox.defaultProps = {
  min: 4,
  max: 72,
};
