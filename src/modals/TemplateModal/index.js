import React, { useReducer } from "react";
import PropTypes from "prop-types";
import { Input } from "reactstrap";
import { modReducer } from "../../utils";
import GenericModal from "../GenericModal";
import Validator from "../../validators/Validator";
import { propertyTypes } from "../../utils/Constants";
import "./style.scss";

export default function TemplateModal(props) {
  const { validators, loadID, fields } = props;

  const [state, setState] = useReducer(modReducer, {
    loadID,
    fields,
    validatorMessage: "",
  });

  function handlePropertyValue(newValue, i) {
    const newFields = [...state.fields];
    newFields[i].property_value = newValue;
    setState({
      fields: newFields,
    });
  }

  function generateField(stateObj, i) {
    return (
      <div key={i} className="padding8px" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <div style={{ minWidth: "100px", textAlign: "right", paddingRight: "10px" }}>
          {stateObj.property_name}
        </div>
        <div style={{ width: "75%" }}>
          <Input
            style={{ color: stateObj.color }}
            className="inputRedPlaceholder"
            value={stateObj.property_value}
            placeholder={stateObj.placeholder}
            onChange={(evt) => handlePropertyValue(evt.currentTarget.value, i)}
          />
        </div>
      </div>
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
        New Template
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
        {generateFields()}
      </div>
    </div>
  );
  const { confirm, close } = props;

  function validateFields() {
    if (validators !== null) {
      let passedValidation;
      let validatorMessage;
      let validatedFields = state.fields;
      for (let i = 0; i < validators.length; i++) {
        [passedValidation, validatorMessage, validatedFields] = validators[i].validate(validatedFields, passedValidation, validatorMessage);
      }
      if (passedValidation) {
        confirm(state);
        close();
      } else {
        setState({
          fields: validatedFields,
          validatorMessage,
        });
      }
    } else {
      confirm(state);
      close();
    }
  }

  const { validatorMessage } = state;

  return (
    <GenericModal
      {...props}
      header={header}
      message={message}
      confirm={validateFields}
      className="modal-120w"
      close={null}
      footerText={validatorMessage}
    />
  );
}

TemplateModal.propTypes = {
  loadID: PropTypes.number,
  close: PropTypes.func.isRequired,
  isShowing: PropTypes.bool.isRequired,
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func,
  validators: PropTypes.arrayOf(PropTypes.instanceOf(Validator)),
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      property_name: PropTypes.string,
      property_type: PropTypes.oneOf(Object.values(propertyTypes)),
      property_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      placeholder: PropTypes.string,
      color: PropTypes.string,
      editable: PropTypes.bool
    })
  ),
};

TemplateModal.defaultProps = {
  validators: null,
  loadID: null,
  cancel: () => {},
  fields: []
};
