import React from "react";
import Select from "react-select";
import Draggable from "react-draggable";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";
import { CustomSelectStyles } from "./CustomSelectStyles";
import "./style.scss";

export default function ControlWidget(props) {
  const {
    right,
    left,
    top,
    onAdd,
    addButtonWidth,
    addButtonText,
    onEdit,
    onDelete,
    onView,
    select,
  } = props;
  console.log(right);
  return (
    <Draggable>
      <div style={{ position: "relative", zIndex: "1002" }}>
        <div
          style={{
            position: "absolute",
            zIndex: "502",
            left: right ? null : left || "422px",
            right: right || null,
            top,
            padding: "4px",
            cursor: "move",
            border: "1px solid black",
            borderRadius: "4px",
            backgroundColor: "lightgray",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {onAdd && (
              <Button
                className="controlButton"
                color="success"
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  width: addButtonWidth,
                }}
                onClick={onAdd}
              >
                {addButtonText}
              </Button>
            )}

            {onEdit && (
              <Button
                className="controlButton"
                color="info"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={onEdit}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            )}

            {onDelete && (
              <Button
                className="controlButton"
                color="danger"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={onDelete}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </Button>
            )}
            {onView && (
              <Button
                className="controlButton"
                color="secondary"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={onView}
                style={{
                  width: "40px",
                }}
              >
                <FontAwesomeIcon
                  icon={faEye}
                  size="lg"
                  style={{ marginLeft: "-6px", color: "white" }}
                />
              </Button>
            )}

            {select && (
              <>
                <div style={{ padding: "8px", paddingRight: "12px" }}>
                  {" "}
                  Showing:
                </div>
                <div
                  style={{ paddingTop: "2px" }}
                  onMouseDown={(e) => e.stopPropagation()} // to prevent dragging when using the dropdown
                >
                  <Select
                    options={select.options}
                    styles={select.styles || CustomSelectStyles}
                    onChange={select.onChange}
                    value={select.value}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
}

ControlWidget.propTypes = {
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  addButtonWidth: PropTypes.string,
  addButtonText: PropTypes.string,
  select: PropTypes.shape({
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    styles: PropTypes.shape({
      control: PropTypes.func,
      dropdownIndicator: PropTypes.func,
      valueContainer: PropTypes.func,
      option: PropTypes.func,
    }),
    value: PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    }),
  }),
};

ControlWidget.defaultProps = {
  onAdd: null,
  onEdit: null,
  onDelete: null,
  onView: null,
  right: null,
  left: null,
  top: "18px",
  addButtonWidth: "112px",
  select: null,
  addButtonText: "New entry",
};
