import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import Draggable from "react-draggable";
import PropTypes from "prop-types";

export default function ColorEditor(props) {
  const {
    color,
    onChange,
    onCommit,
    onCommitCancel,
    scale,
    positionOffset,
  } = props;
  const [state, setState] = useState({
    color,
  });

  useEffect(() => {
    setState((oldState) => ({
      ...oldState,
      color,
    }));
  }, [color]);

  function handleChangeComplete() {
    onCommit();
  }
  function handleCancel() {
    onCommitCancel();
  }

  function handleChange(newColor) {
    setState(() => ({
      ...state,
      color: newColor.hex,
    }));
    onChange(newColor.hex);
  }

  return (
    <div
      style={{
        position: "absolute",
        zIndex: "100",
        transform: `scale(${scale})`,
      }}
    >
      <Draggable
        handle=".handle"
        positionOffset={positionOffset}
        scale={scale}
      >
        <div style={{ margin: "2px" }}>
          <div
            style={{
              border: "0px solid red",
              height: "24px",
              width: "513px",
              position: "absolute",
              top: "0px",
              zIndex: "100",
              cursor: "move",
            }}
            className="handle"
          />
          <div style={{ position: "absolute" }}>
            <SketchPicker
              color={color}
              onChange={handleChange}
              onChangeComplete={handleChangeComplete}
              onAccept={handleChangeComplete}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </Draggable>
    </div>
  );
}

ColorEditor.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
  onCommitCancel: PropTypes.func.isRequired,
  scale: PropTypes.number,
  positionOffset: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

ColorEditor.defaultProps = {
  scale: 1,
  positionOffset: { x: 0, y: 0 },
  color: "white",
};
