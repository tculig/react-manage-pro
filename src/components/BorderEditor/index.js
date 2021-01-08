import React from "react";
import FontPicker from "font-picker-react";
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { ButtonToggle, Dropdown } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { MyNumericBox } from "./MyNumericBox";
import { CompactPicker } from "react-color";
import Select from "react-select";
import { CustomSelectStyles } from "./CustomSelectStyles";

export class BorderEditor extends React.Component {
  constructor(props) {
    super(props);
    let optionsArray = [];
    for (let i = 2; i <= 28; i++) {
      if (i % 2 == 0) {
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
    this.state = {
      borderWidth: this.borderWidthOptions[0],
      borderColor: "red",
      borderStyle: this.borderStyleOptions[1],
      showColorPicker: false,
      borderRadius: 8,
      borderRadiusOptions: optionsArray,
      testBoxPadding: "10px 2px 10px 2px",
    };
  }

  updateBorderRadius = (newValue) => {
    this.setState({
      borderRadius: newValue,
    });
  };
  updateBorderWidth = (newValue) => {
    this.setState({
      borderWidth: newValue,
      testBoxPadding: newValue.testBoxPadding,
    });
  };
  updateBorderStyle = (newValue) => {
    this.setState({
      borderStyle: {
        value: newValue.value,
        label: newValue.value,
      },
    });
  };
  updateBorderColor = (color, event) => {
    this.setState(() => ({
      borderColor: color.hex,
      showColorPicker: false,
    }));
  };
  toggleColorPicker = () => {
    this.setState(() => ({
      showColorPicker: !this.state.showColorPicker,
    }));
  };
  borderWidthOptions = [
    { value: "thin", label: "Thin", testBoxPadding: "10px 2px 10px 2px" },
    { value: "medium", label: "Medium", testBoxPadding: "8px 2px 8px 2px" },
    { value: "thick", label: "Thick", testBoxPadding: "6px 2px 6px 2px" },
  ];
  borderStyleOptions = [
    { value: "None", label: "None", textLabel: "None" },
    {
      value: "Solid",
      label: (
        <div style={{ padding: "4px" }}>
          <div
            style={{
              height: "20px",
              width: "100%",
              border: "5px solid black",
            }}
          ></div>
        </div>
      ),
    },
    {
      value: "Dotted",
      label: (
        <div style={{ padding: "4px" }}>
          <div
            style={{
              height: "20px",
              width: "100%",
              border: "5px dotted black",
            }}
          ></div>
        </div>
      ),
    },
    {
      value: "Dashed",
      label: (
        <div style={{ padding: "4px" }}>
          <div
            style={{
              height: "20px",
              width: "100%",
              border: "5px dashed black",
            }}
          ></div>
        </div>
      ),
    },
    {
      value: "Double",
      label: (
        <div style={{ padding: "4px" }}>
          <div
            style={{
              height: "20px",
              width: "100%",
              border: "5px double black",
            }}
          ></div>
        </div>
      ),
    },
    {
      value: "Groove",
      label: (
        <div style={{ padding: "4px" }}>
          <div
            style={{
              height: "20px",
              width: "100%",
              border: "5px groove gray",
            }}
          ></div>
        </div>
      ),
    },
    {
      value: "Ridge",
      label: (
        <div style={{ padding: "4px" }}>
          <div
            style={{
              height: "20px",
              width: "100%",
              border: "5px ridge gray",
            }}
          ></div>
        </div>
      ),
    },
    {
      value: "Inset",
      label: (
        <div style={{ padding: "4px" }}>
          <div
            style={{
              height: "20px",
              width: "100%",
              border: "5px inset gray",
            }}
          ></div>
        </div>
      ),
    },
    {
      value: "Outset",
      label: (
        <div style={{ padding: "4px" }}>
          <div
            style={{
              height: "20px",
              width: "100%",
              border: "5px outset gray",
            }}
          ></div>
        </div>
      ),
    },
  ];

  render() {
    return (
      <div style={{ position: "absolute", zIndex: "100" }}>
        <Draggable
          handle=".handle"
          scale={this.props.scale}
          positionOffset={this.props.positionOffset}
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
                  Border editor
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
                        padding: "8px 8px 8px 0px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ lineHeight: "36px" }}>
                        Width:&nbsp;&nbsp;
                      </div>
                      <div
                        style={{
                          width: "100%",
                          padding: "0px",
                        }}
                      >
                        <Select
                          value={this.state.borderWidth}
                          onChange={this.updateBorderWidth}
                          options={this.borderWidthOptions}
                          styles={CustomSelectStyles}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        padding: "0px 8px 0px 8px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ lineHeight: "36px" }}>
                        Style:&nbsp;&nbsp;
                      </div>
                      <div
                        style={{
                          width: "100%",
                          padding: "0px",
                        }}
                      >
                        <Select
                          value={this.state.borderStyle}
                          onChange={this.updateBorderStyle}
                          options={this.borderStyleOptions}
                          styles={CustomSelectStyles}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "12px 8px 4px 0px",
                      }}
                    >
                      <div
                        style={{
                          borderStyle: this.state.borderStyle.value,
                          borderWidth: this.state.borderWidth.value,
                          borderRadius: this.state.borderRadius,
                          borderColor: this.state.borderColor,
                          padding: this.state.testBoxPadding,
                        }}
                      >
                        The quick brown fox jumps over the lazy dog.
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "35%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px 4px 0px 4px",
                      }}
                    >
                      <button className="myOKCancelButton">OK</button>
                      <button className="myOKCancelButton">Cancel</button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div>Border radius:</div>
                      <MyNumericBox
                        updateParent={this.updateBorderRadius}
                        options={this.state.borderRadiusOptions}
                        defaultValue={12}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "4px",
                      }}
                    >
                      <div>Border color:</div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{
                            margin: "auto",
                            marginTop: "4px",
                            width: "56px",
                            height: "36px",
                            border: "1px solid black",
                            cursor: "pointer",
                            background: this.state.borderColor,
                          }}
                          onClick={this.toggleColorPicker}
                        ></div>
                        {this.state.showColorPicker && (
                          <div
                            style={{
                              position: "absolute",
                              zIndex: "200",
                            }}
                          >
                            <CompactPicker
                              color={this.state.borderColor}
                              onChange={this.updateBorderColor}
                            />
                          </div>
                        )}
                      </div>
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
}
