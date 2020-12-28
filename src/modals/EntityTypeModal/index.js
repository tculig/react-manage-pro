import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useReducer } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { Button, Input } from "reactstrap";
import { modReducer } from "../../utils";
import GenericModal from "../GenericModal";
import "./style.scss";

export default function EntityTypeModal(props) {
  // values have to be actual MYSQL variable types!
  const fieldTypes = [
    { value: "TEXT", label: "Text" },
    { value: "INT", label: "Integer" },
    { value: "DECIMAL(10,2)", label: "Decimal" },
    { value: "DATE", label: "Date" },
  ];

  const initRowsNum = 3;
  const { loadID } = props;

  const [state, setState] = useReducer(modReducer, {
    entityName: "",
    fields: (() => {
      const initValues = [];
      if (loadID !== null) return initValues;
      initValues.push({
        fieldName: "Name",
        disabled: true,
        fieldType: fieldTypes[0],
      });
      for (let i = 0; i < initRowsNum; i++) {
        initValues.push({
          fieldName: "",
          disabled: false,
          fieldType: fieldTypes[0],
        });
      }
      return initValues;
    })(),
  });

  function removeField(i) {
    const newFields = [...state.fields];
    newFields.splice(i, 1);
    setState({
      fields: newFields,
    });
  }
  function addField() {
    const newFields = [...state.fields];
    newFields.push({
      fieldName: "",
      disabled: false,
      fieldType: fieldTypes[0],
    });
    setState({
      fields: newFields,
    });
  }
  function handleFieldName(value, i) {
    const newFields = [...state.fields];
    newFields[i].fieldName = value;
    setState({
      fields: newFields,
    });
  }
  function handleFieldType(selectedOption, i) {
    const newFields = [...state.fields];
    newFields[i].fieldType = selectedOption;
    setState({
      fields: newFields,
    });
  }

  function generateField(stateObj, i) {
    return (
      <tr key={i} className="padding8px">
        <td>
          <Input
            value={stateObj.fieldName}
            onChange={(evt) => handleFieldName(evt.currentTarget.value, i)}
            disabled={stateObj.disabled}
          />
        </td>
        <td>
          <Select
            onChange={(selectedOption) => handleFieldType(selectedOption, i)}
            value={stateObj.fieldType}
            options={fieldTypes}
            isDisabled={stateObj.disabled}
          />
        </td>
        <td>
          {!stateObj.disabled && (
            <Button
              color="danger"
              style={{ margin: "0px" }}
              onClick={() => {
                removeField(i);
              }}
            >
              <div
                style={{
                  pointerEvents:
                    "none" /* This is so that the button is the event target, no the flippin icon */,
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </div>
            </Button>
          )}
        </td>
      </tr>
    );
  }

  function generateFields() {
    const fieldsHTML = [];
    for (let i = 0; i < state.fields.length; i++) {
      fieldsHTML.push(generateField(state.fields[i], i));
    }
    return fieldsHTML;
  }

  const header = (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: "4px",
      }}
    >
      <div style={{ width: "30%", textAlign: "right", paddingRight: "10px" }}>
        Entity name:
      </div>
      <div style={{ width: "70%" }}>
        <Input
          value={state.entityName}
          onChange={(evt) => setState({ entityName: evt.currentTarget.value })}
        />
      </div>
    </div>
  );

  const message = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "4px",
        }}
      >
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: "55%" }} scope="col">
                Field name
              </th>
              <th style={{ width: "35%" }} scope="col">
                Field type
              </th>
              <th style={{ width: "10%" }} scope="col" />
            </tr>
          </thead>
          <tbody>{generateFields()}</tbody>
        </table>
      </div>
      <div style={{ margin: "4px" }}>
        <Button color="success" onClick={addField}>
          Add field
        </Button>
      </div>
    </div>
  );
  const { confirm } = props;
  const { entityName, fields } = state;

  return (
    <GenericModal
      {...props}
      header={header}
      message={message}
      confirm={() => { confirm(entityName, fields); }}
      className="modal-120w"
    />
  );
}

EntityTypeModal.propTypes = {
  loadID: PropTypes.number,
  close: PropTypes.func.isRequired,
  isShowing: PropTypes.bool.isRequired,
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func,
};

EntityTypeModal.defaultProps = {
  loadID: null,
  cancel: () => {}
};
