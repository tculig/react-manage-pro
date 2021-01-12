import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import DraggableTable from "../../ui/DraggableTable";
import "./style.scss";
import { getEntityTypeProperties } from "./dbcalls";

export default function ActiveFieldsEditor(props) {
  const {
    onCommit,
    onCommitCancel,
    onChange,
    scale,
    positionOffset,
    entityTypeId,
    entityDataConfiguration,
  } = props;

  const [entityTypeState, setEntityTypeState] = useState([]);

  useEffect(() => {
    async function asyncFunc() {
      console.log(entityTypeId);
      if (entityTypeId === null) return;
      let entityTypeProperties = await getEntityTypeProperties(entityTypeId);
      entityTypeProperties = entityTypeProperties.map((el) => {
        if (entityDataConfiguration.includes(el.id)) {
          el.checked = true;
        } else {
          el.checked = false;
        }
        return el;
      });
      setEntityTypeState(entityTypeProperties);
    }
    asyncFunc();
  }, [entityTypeId]);

  useEffect(() => {
    const entityTypeProperties = entityTypeState.map((el) => {
      if (entityDataConfiguration.includes(el.id)) {
        el.checked = true;
      } else {
        el.checked = false;
      }
      return el;
    });
    setEntityTypeState(entityTypeProperties);
  }, [entityDataConfiguration]);

  function handleChangeComplete() {
    onCommit();
  }
  function handleCancel() {
    onCommitCancel();
  }

  function toggleChecked(i) {
    const newFields = [...entityTypeState];
    newFields[i].checked = !newFields[i].checked;
    const newConfig = newFields.map((el) => (el.checked ? el.id : null));
    console.log(newConfig);
    onChange(newConfig);
  }

  function onDraggableChange() {
    console.log("yolo");
  }

  function generateField(stateObj, i) {
    return (
      <>
        <div className="myTd" style={{ width: "53%" }}>
          <Input value={stateObj.property_name} disabled />
        </div>
        <div className="myTd" style={{ width: "30%" }}>
          <Input disabled value={stateObj.property_type} />
        </div>
        <div
          className="myTd"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "15%",
            cursor: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <Input
              type="checkbox"
              checked={stateObj.checked}
              onChange={() => toggleChecked(i)}
              style={{
                margin: "auto",
                flexGrow: "1",
                height: "20px",
                position: "relative",
              }}
            />
          </div>
        </div>
      </>
    );
  }

  function generateTableRows() {
    const fieldsHTML = [];
    for (let i = 0; i < entityTypeState.length; i++) {
      fieldsHTML.push(generateField(entityTypeState[i], i));
    }
    return fieldsHTML;
  }

  return (
    <div
      style={{
        position: "absolute",
        zIndex: "100",
        transform: `scale(${scale})`,
      }}
    >
      <Draggable handle=".handleOuter" positionOffset={positionOffset}>
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
            className="handleOuter"
          />
          <ModalHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                margin: "4px",
              }}
            >
              <div
                style={{
                  width: "30%",
                  textAlign: "right",
                  paddingRight: "10px",
                }}
              >
                Entity name:
              </div>
              <div style={{ width: "70%" }}>
                <Input disabled value="PENIS" />
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "4px",
                }}
              >
                <div
                  className="table  myTableMock"
                  style={{ position: "relative", transition: "all 0.3s" }}
                >
                  <div
                    className="myTr"
                    style={{
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >
                    <div style={{ width: "7%" }} className="myTh">
                      #
                    </div>
                    <div style={{ width: "53%" }} className="myTh">
                      Field name
                    </div>
                    <div style={{ width: "30%" }} className="myTh">
                      Field type
                    </div>
                    <div style={{ width: "15%" }} className="myTh">
                      Show
                    </div>
                  </div>

                  <div>
                    <DraggableTable
                      onChange={onDraggableChange}
                      showRowCount
                      tableRows={generateTableRows()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleChangeComplete}>
              Confirm
            </Button>
            <Button color="danger" onClick={handleCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </div>
      </Draggable>
    </div>
  );
}

ActiveFieldsEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
  onCommitCancel: PropTypes.func.isRequired,
  entityDataConfiguration: PropTypes.arrayOf(PropTypes.number),
  entityTypeId: PropTypes.number,
  scale: PropTypes.number,
  positionOffset: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

ActiveFieldsEditor.defaultProps = {
  scale: 1,
  positionOffset: { x: 0, y: 0 },
  entityDataConfiguration: [],
  entityTypeId: null,
};
