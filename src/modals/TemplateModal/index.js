import React, { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "reactstrap";
import { modReducer } from "../../utils";
import GenericModal from "../GenericModal";
import Validator from "../../utils/Validator";
import { propertyTypes } from "../Constants";
import { getTemplateData } from "./dbcalls";
import "./style.scss";

export default function TemplateModal(props) {
  const { entityTypeBasicInfo, validator, loadID } = props;

  const [state, setState] = useReducer(modReducer, {
    fields: [],
    validatorMessage: "",
  });

  useEffect(() => {
    async function loadFromDB() {
      const templateData = await getTemplateData(loadID);
      console.log(templateData);
      if (templateData !== null) {
        setState({
          fields: templateData,
        });
      }
    }
    if (loadID != null) {
      loadFromDB();
    }
  }, [loadID]); // eslint-disable-line

  function handlePropertyValue(newValue, i) {
    const newFields = [...state.fields];
    newFields[i].property_value = newValue;
    setState({
      fields: newFields,
    });
  }

  function generateField(stateObj, i) {
    return (
      <div key={i} className="padding8px">
        <div style={{ width: "25%" }}>
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
    if (validator !== null) {
      const [passedValidation, validatorMessage, validatedFields] = validator.validate(state.fields);
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
  templateBasicInfo: PropTypes.shape({
    label: PropTypes.string,
    id: PropTypes.number,
  }),
  validator: PropTypes.instanceOf(Validator),
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      property_name: PropTypes.string,
      property_type: PropTypes.oneOf(propertyTypes),
      property_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      placeholder: PropTypes.string,
      color: PropTypes.string,
      editable: PropTypes.bool
    })
  ),
};

TemplateModal.defaultProps = {
  validator: null,
  templateBasicInfo: {},
  loadID: null,
  cancel: () => {},
  fields: []
};
