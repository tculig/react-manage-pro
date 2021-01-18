import React, { useState } from "react";
import FontPicker from "font-picker-react";
import Draggable from "react-draggable";
import PropTypes from "prop-types";
import { CompactPicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faItalic, faUnderline, faAlignCenter, faAlignLeft, faAlignRight, faAlignJustify } from "@fortawesome/free-solid-svg-icons";
import CustomNumericBox from "../CustomNumericBox";
import "./style.scss";

const short = require("short-uuid");

export default function FontEditor(props) {
  const {
    onCommit,
    onCommitCancel,
    onChange,
    fontSizeOptions,
    pickerID,
    scale,
    positionOffset,
    fontWeight,
    fontStyle,
    textDecoration,
    fontSize,
    color,
    textAlign,
    fontFamily,
  } = props;

  const [internalState, setInternalState] = useState({
    showColorPicker: false,
  });

  function toggleBold() {
    onChange({
      fontWeight: fontWeight === 400 ? 800 : 400,
    });
  }
  function toggleItalic() {
    onChange({
      fontStyle: fontStyle === "normal" ? "italic" : "normal",
    });
  }
  function toggleUnderline() {
    onChange({
      textDecoration: textDecoration === "none" ? "underline" : "none",
    });
  }
  function toggleColorPicker() {
    setInternalState((oldInternalState) => ({
      showColorPicker: !oldInternalState.showColorPicker,
    }));
  }
  function updateFontSize(newFontSize) {
    onChange({
      fontSize: newFontSize.value,
    });
  }
  function updateFontColor(newColor) {
    setInternalState({
      showColorPicker: false,
    });
    onChange({
      color: newColor.hex,
    });
  }
  function updateFontFamily(nextFont) {
    onChange({
      fontFamily: nextFont.family,
    });
  }
  function toggleAlign(alignWhere) {
    onChange({
      textAlign: alignWhere,
    });
  }

  function handleChangeComplete() {
    onCommit();
  }
  function handleCancel() {
    onCommitCancel();
  }

  const { showColorPicker } = internalState;

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
              width: "380px",
              position: "absolute",
              top: "0px",
              zIndex: "100",
              cursor: "move",
            }}
            className="handle"
          />
          <div style={{ position: "absolute" }}>
            <div
              style={{
                background: "rgb(236, 236, 236)",
                borderRadius: "4px",
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px",
                boxSizing: "initial",
                width: "380px",
              }}
            >
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(-180deg, rgb(240, 240, 240) 0%, rgb(212, 212, 212) 100%)",
                  borderBottom: "1px solid rgb(177, 177, 177)",
                  boxShadow:
                    "rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.02) 0px -1px 0px 0px inset",
                  height: "23px",
                  lineHeight: "24px",
                  borderRadius: "4px 4px 0px 0px",
                  fontSize: "13px",
                  color: "rgb(77, 77, 77)",
                  textAlign: "center",
                }}
              >
                Font editor
              </div>
              <div
                className="flexbox-fix"
                style={{
                  padding: "15px 15px 15px 15px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "65%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: "10px",
                    }}
                  >
                    <button
                      type="button"
                      className={`myToggleButton ${
                        textAlign === "left" ? " myToggleDown" : ""
                      }`}
                      onClick={() => toggleAlign("left")}
                      style={{ margin: "4px", marginLeft: "0px" }}
                    >
                      <FontAwesomeIcon icon={faAlignLeft} />
                    </button>

                    <button
                      type="button"
                      className={`myToggleButton ${
                        textAlign === "center" ? " myToggleDown" : ""
                      }`}
                      onClick={() => toggleAlign("center")}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faAlignCenter} />
                    </button>

                    <button
                      type="button"
                      className={`myToggleButton ${
                        textAlign === "right" ? " myToggleDown" : ""
                      }`}
                      onClick={() => toggleAlign("right")}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faAlignRight} />
                    </button>

                    <button
                      type="button"
                      className={`myToggleButton ${
                        textAlign === "justify" ? " myToggleDown" : ""
                      }`}
                      onClick={() => toggleAlign("justify")}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faAlignJustify} />
                    </button>
                  </div>
                  <FontPicker
                    apiKey="AIzaSyCH4ssHDe9Cd6iqYtvlzX9s75Qd6JCijM4"
                    activeFontFamily={fontFamily}
                    pickerId={pickerID}
                    style={{ width: "100px" }}
                    onChange={updateFontFamily}
                  />
                  <div
                    className={`apply-font-${pickerID}`}
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "0px solid black",
                      borderRadius: "2px",
                      padding: "2px",
                      marginRight: "6px",
                      fontWeight,
                      fontStyle,
                      textDecoration,
                      fontSize,
                      color,
                      textAlign,
                      width: "150%" // Return to 100% if the OK and Cancel button are reinstated
                    }}
                  >
                    The quick brown fox jumps over the lazy dog.
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "35%",
                  }}
                >
                  <div style={{ display: "none", flexDirection: "column" }}>
                    { /* Disabled for now, but left for future use */ }
                    <button
                      type="button"
                      className="myOKCancelButton"
                      onClick={handleChangeComplete}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      className="myOKCancelButton"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <button
                      type="button"
                      className={`myToggleButton${
                        fontWeight === "800" ? " myToggleDown" : ""
                      }`}
                      onClick={toggleBold}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faBold} />
                    </button>
                    <button
                      type="button"
                      className={`myToggleButton${
                        fontStyle === "italic" ? " myToggleDown" : ""
                      }`}
                      onClick={toggleItalic}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faItalic} />
                    </button>
                    <button
                      type="button"
                      className={`myToggleButton${
                        textDecoration === "underline" ? " myToggleDown" : ""
                      }`}
                      onClick={toggleUnderline}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faUnderline} />
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", paddingTop: "6px" }}>
                    <div
                      style={{
                        margin: "4px",
                        width: "56px",
                        height: "36px",
                        border: "1px solid black",
                        cursor: "pointer",
                        background: color,
                      }}
                      onClick={toggleColorPicker}
                    />
                    {showColorPicker && (
                      <div style={{ position: "absolute", zIndex: "200" }}>
                        <CompactPicker
                          color={color}
                          onChange={updateFontColor}
                        />
                      </div>
                    )}
                    <CustomNumericBox
                      onChange={updateFontSize}
                      options={fontSizeOptions}
                      value={fontSize}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
}

FontEditor.propTypes = {
  pickerID: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
  onCommitCancel: PropTypes.func.isRequired,
  scale: PropTypes.number,
  positionOffset: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  fontFamily: PropTypes.string,
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontStyle: PropTypes.string,
  textDecoration: PropTypes.string,
  textAlign: PropTypes.string,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  fontSizeOptions: PropTypes.arrayOf(PropTypes.object),
};

FontEditor.defaultProps = {
  pickerID: short.generate(),
  scale: 1,
  positionOffset: { x: 0, y: 0 },
  fontFamily: "Open Sans",
  fontWeight: 400,
  fontStyle: "normal",
  textDecoration: "none",
  textAlign: "left",
  fontSize: 24,
  color: "black",
  fontSizeOptions: (() => {
    const optionsArray = [];
    for (let i = 4; i <= 72; i++) {
      if (i % 4 === 0) {
        optionsArray.push(
          <option value={i} key={i}>
            {i}
          </option>
        );
      } else {
        optionsArray.push(
          <option style={{ display: "none" }} key={i} value={i}>
            {i}
          </option>
        );
      }
    }
    return optionsArray;
  })(),
};
