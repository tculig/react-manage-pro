import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useReducer, useEffect } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { Button, Input } from "reactstrap";
import { modReducer } from "../../utils";
import GenericModal from "../GenericModal";
import { getEntityType } from "./dbcalls";
import "./style.scss";

export default function EntityTypeModal(props) {
  // values have to be actual MYSQL variable types!
  const propertyTypes = [
    { value: "TEXT", label: "Text" },
    { value: "INT", label: "Integer" },
    { value: "DECIMAL(10,2)", label: "Decimal" },
    { value: "DATE", label: "Date" },
  ];

  function mapPropertyTypes(arrayIn) {
    const arrayOut = arrayIn.map((el) => {
      for (let i = 0; i < propertyTypes.length; i++) {
        if (propertyTypes[i].value === el.property_type) {
          el.property_type = propertyTypes[i];
        }
      }
      return el;
    });
    return arrayOut;
  }

  const initRowsNum = 3;
  const { loadID, entityBasicInfo } = props;

  const [state, setState] = useReducer(modReducer, {
    name: "",
    fields: (() => {
      const initValues = [];
      if (loadID !== null) return initValues;
      initValues.push({
        property_name: "Name",
        editable: false,
        property_type: propertyTypes[0],
      });
      for (let i = 0; i < initRowsNum; i++) {
        initValues.push({
          property_name: "",
          editable: true,
          property_type: propertyTypes[0],
        });
      }
      return initValues;
    })(),
  });

  useEffect(() => {
    async function loadFromDB() {
      const entityTypeData = await getEntityType(loadID);
      if (entityTypeData !== null) {
        setState({
          name: entityBasicInfo.name,
          fields: mapPropertyTypes(entityTypeData),
          originalFields: entityTypeData
        });
      }
    }
    if (loadID != null) {
      loadFromDB();
    }
  }, [loadID, entityBasicInfo]); // eslint-disable-line

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
      property_name: "",
      editable: true,
      property_type: propertyTypes[0],
    });
    setState({
      fields: newFields,
    });
  }
  function handlePropertyName(value, i) {
    const newFields = [...state.fields];
    newFields[i].property_name = value;
    setState({
      fields: newFields,
    });
  }
  function handlePropertyType(selectedOption, i) {
    const newFields = [...state.fields];
    newFields[i].property_type = selectedOption;
    setState({
      fields: newFields,
    });
  }

  function generateField(stateObj, i) {
    const editable = !!stateObj.editable;
    return (
      <tr key={i} className="padding8px">
        <td>
          <Input
            value={stateObj.property_name}
            onChange={(evt) => handlePropertyName(evt.currentTarget.value, i)}
            disabled={!editable}
          />
        </td>
        <td>
          <Select
            onChange={(selectedOption) => handlePropertyType(selectedOption, i)}
            value={stateObj.property_type}
            options={propertyTypes}
            isDisabled={!editable}
          />
        </td>
        <td>
          {editable && (
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
          value={state.name}
          onChange={(evt) => setState({ name: evt.currentTarget.value })}
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

  return (
    <GenericModal
      {...props}
      header={header}
      message={message}
      confirm={() => { confirm(state); }}
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
  entityBasicInfo: PropTypes.shape({ name: PropTypes.string })
};

EntityTypeModal.defaultProps = {
  entityBasicInfo: {},
  loadID: null,
  cancel: () => {}
};
