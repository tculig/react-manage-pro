import React, { useReducer, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { Input } from "reactstrap";
import { modReducer } from "../../utils";
import GenericModal from "../GenericModal";
import { getEntityTypeProperties } from "./dbcalls";
import Validator from "../../validators/Validator";
import { propertyTypes } from "../../utils/Constants";
import "./style.scss";

export default function EntityInstanceModal(props) {
  function mapPropertyTypes(arrayIn) {
    const arrayOut = arrayIn.map((el) => {
      Object.entries(propertyTypes).forEach(([, propValue]) => {
        if (propValue.value === el.property_type) {
          el.property_type = propValue;
        }
      });
      el.property_value = "";
      el.placeholder = "";
      el.color = "inherit";
      return el;
    });
    return arrayOut;
  }

  const { entityTypeBasicInfo, validators, loadID } = props;

  const [state, setState] = useReducer(modReducer, {
    entityTypeId: entityTypeBasicInfo.id,
    name: entityTypeBasicInfo.label,
    fields: [],
    validatorMessage: ""
  });

  useEffect(() => {
    async function loadFromDB() {
      console.log(loadID);
    }
    if (loadID) {
      loadFromDB();
    }
  }, [loadID]);// eslint-disable-line

  useEffect(() => {
    async function loadFromDB() {
      const entityTypeProperties = await getEntityTypeProperties(entityTypeBasicInfo.id);
      if (entityTypeProperties !== null) {
        setState({
          fields: mapPropertyTypes(entityTypeProperties)
        });
      }
    }
    if (entityTypeBasicInfo.id != null) {
      loadFromDB();
    }
  }, [entityTypeBasicInfo.id]);// eslint-disable-line

  function handleFieldConstraints(originalField, newValue) {
    // decimal constraint
    if (originalField.property_type.value === "DECIMAL(10,2)") {
      const dotIndex = newValue.indexOf(".");
      if (dotIndex !== -1) {
        if (newValue.length > (dotIndex + 3)) {
          return originalField.property_value;
        }
      }
    }
    return newValue;
  }

  function handlePropertyValue(newValue, i) {
    const newFields = [...state.fields];
    newFields[i].property_value = handleFieldConstraints(newFields[i], newValue);
    setState({
      fields: newFields,
    });
  }

  function generateField(stateObj, i) {
    return (
      <tr key={i} className="padding8px">
        <td>
          <Input
            value={stateObj.property_name}
            disabled
          />
        </td>
        <td>
          <Select
            value={stateObj.property_type}
            isDisabled
          />
        </td>
        <td>
          <Input
            style={{ color: stateObj.color }}
            className="inputRedPlaceholder"
            value={stateObj.property_value}
            placeholder={stateObj.placeholder}
            onChange={(evt) => handlePropertyValue(evt.currentTarget.value, i)}
          />
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
        New Entity:
      </div>
      <div style={{ width: "70%" }}>
        <Input
          value={state.name}
          disabled
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
              <th style={{ width: "25%" }} scope="col">
                Field name
              </th>
              <th style={{ width: "25%" }} scope="col">
                Field type
              </th>
              <th style={{ width: "50%" }} scope="col">
                Value
              </th>
            </tr>
          </thead>
          <tbody>{generateFields()}</tbody>
        </table>
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
          validatorMessage
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

EntityInstanceModal.propTypes = {
  loadID: PropTypes.number,
  close: PropTypes.func.isRequired,
  isShowing: PropTypes.bool.isRequired,
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func,
  entityTypeBasicInfo: PropTypes.shape({
    label: PropTypes.string,
    id: PropTypes.number
  }),
  validators: PropTypes.arrayOf(PropTypes.instanceOf(Validator))
};

EntityInstanceModal.defaultProps = {
  validators: null,
  entityTypeBasicInfo: {},
  loadID: null,
  cancel: () => {}
};
