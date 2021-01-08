import React, { useEffect, useState, useRef } from "react";
import FontPicker from "font-picker-react";
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faAlignJustify,
} from "@fortawesome/free-solid-svg-icons";
import { CustomNumericBox } from "../CustomNumericBox";
import { CompactPicker } from "react-color";

export function FontEditor(props) {
  const [state, setState] = useState({
    fontFamily: props.fontConfiguration.fontFamily || "Open Sans",
    fontWeight: props.fontConfiguration.fontWeight || "400",
    fontStyle: props.fontConfiguration.fontStyle || "normal",
    textDecoration: props.fontConfiguration.textDecoration || "none",
    textAlign: props.fontConfiguration.textAlign || "left",
    fontSize: props.fontConfiguration.fontSize || 24,
    color: props.fontConfiguration.color || "red",
    textJustify: props.fontConfiguration.textJustify || "inter-character", //firefox only! bot not even there QQ
  });
  const updateFromProps = useRef(false);

  useEffect(() => {
    updateFromProps.current = true;
    setState(() => ({
      ...state,
      ...props.fontConfiguration,
    }));
  }, [props.fontConfiguration]);

  useEffect(() => {
    if (props.onChange && !updateFromProps.current) {
      props.onChange(props.gridletName, state);
    } else {
      updateFromProps.current = false;
    }
  }, [state]);

  const [internalState, setInternalState] = useState({
    showColorPicker: false,
    fontSizeOptions: [],
  });

  useEffect(() => {
    let optionsArray = [];
    for (let i = 4; i <= 72; i++) {
      if (i % 4 == 0) {
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
    setInternalState({
      ...internalState,
      fontSizeOptions: optionsArray,
    });
  }, []);

  function toggleBold() {
    setState(() => ({
      ...state,
      fontWeight: state.fontWeight == "400" ? "800" : "400",
    }));
  }
  function toggleItalic() {
    setState(() => ({
      ...state,
      fontStyle: state.fontStyle == "normal" ? "italic" : "normal",
    }));
  }
  function toggleUnderline() {
    setState(() => ({
      ...state,
      textDecoration: state.textDecoration == "none" ? "underline" : "none",
    }));
  }
  function toggleColorPicker() {
    setInternalState(() => ({
      ...internalState,
      showColorPicker: !internalState.showColorPicker,
    }));
  }
  function updateFontSize(newFontSize) {
    setState({
      ...state,
      fontSize: newFontSize,
    });
  }
  function updateFontColor(color, event) {
    setInternalState(() => ({
      ...internalState,
      showColorPicker: false,
    }));
    setState({
      ...state,
      color: color.hex,
    });
  }
  function updateFontFamily(nextFont) {
    setState({
      ...state,
      fontFamily: nextFont.family,
    });
  }
  function toggleAlign(where) {
    setState({
      ...state,
      textAlign: where,
    });
  }

  function handleChangeComplete(color, event) {
    props.onCommit(props.gridletName);
  }
  function handleCancel() {
    props.onCommitCancel(props.gridletName);
  }

  return (
    <div style={{ position: "absolute", zIndex: "100" }}>
      <Draggable
        handle=".handle"
        scale={props.scale}
        positionOffset={props.positionOffset}
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
          ></div>
          <div style={{ position: "absolute" }}>
            <div
              className="photoshop-picker"
              style={{
                background: "rgb(220, 220, 220)",
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
                      className={
                        "myToggleButton" +
                        (state.textAlign == "left" ? " myToggleDown" : "")
                      }
                      onClick={() => toggleAlign("left")}
                      style={{ margin: "4px", marginLeft: "0px" }}
                    >
                      <FontAwesomeIcon icon={faAlignLeft} />
                    </button>

                    <button
                      className={
                        "myToggleButton" +
                        (state.textAlign == "center" ? " myToggleDown" : "")
                      }
                      onClick={() => toggleAlign("center")}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faAlignCenter} />
                    </button>

                    <button
                      className={
                        "myToggleButton" +
                        (state.textAlign == "right" ? " myToggleDown" : "")
                      }
                      onClick={() => toggleAlign("right")}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faAlignRight} />
                    </button>

                    <button
                      className={
                        "myToggleButton" +
                        (state.textAlign == "justify" ? " myToggleDown" : "")
                      }
                      onClick={() => toggleAlign("justify")}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faAlignJustify} />
                    </button>
                  </div>
                  <FontPicker
                    apiKey="AIzaSyCH4ssHDe9Cd6iqYtvlzX9s75Qd6JCijM4"
                    activeFontFamily={state.fontFamily}
                    pickerId={props.gridletName}
                    style={{ width: "100px" }}
                    onChange={updateFontFamily}
                  />
                  <div
                    className={"apply-font-" + props.gridletName}
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "0px solid black",
                      borderRadius: "2px",
                      padding: "2px",
                      marginRight: "6px",
                      fontWeight: state.fontWeight,
                      fontStyle: state.fontStyle,
                      textDecoration: state.textDecoration,
                      fontSize: state.fontSize,
                      color: state.color,
                      textAlign: state.textAlign,
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
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      className="myOKCancelButton"
                      onClick={handleChangeComplete}
                    >
                      OK
                    </button>
                    <button className="myOKCancelButton" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <button
                      className={
                        "myToggleButton" +
                        (state.fontWeight == "800" ? " myToggleDown" : "")
                      }
                      onClick={toggleBold}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faBold} />
                    </button>
                    <button
                      className={
                        "myToggleButton" +
                        (state.fontStyle == "italic" ? " myToggleDown" : "")
                      }
                      onClick={toggleItalic}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faItalic} />
                    </button>
                    <button
                      className={
                        "myToggleButton" +
                        (state.textDecoration == "underline"
                          ? " myToggleDown"
                          : "")
                      }
                      onClick={toggleUnderline}
                      style={{ margin: "4px" }}
                    >
                      <FontAwesomeIcon icon={faUnderline} />
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      style={{
                        margin: "4px",
                        width: "56px",
                        height: "36px",
                        border: "1px solid black",
                        cursor: "pointer",
                        background: state.color,
                      }}
                      onClick={toggleColorPicker}
                    ></div>
                    {internalState.showColorPicker && (
                      <div style={{ position: "absolute", zIndex: "200" }}>
                        <CompactPicker
                          color={state.color}
                          onChange={updateFontColor}
                        />
                      </div>
                    )}
                    <CustomNumericBox
                      updateParent={updateFontSize}
                      options={internalState.fontSizeOptions}
                      defaultValue={state.fontSize}
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
