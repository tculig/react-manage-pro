import PropTypes from "prop-types";
import React, { useEffect, useReducer, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ReactDOM from "react-dom";
import { modReducer } from "../../utils";
import { getEntityReports } from "./dbcalls";
import ReportModal from "../ReportModal";
import "./style.scss";

export default function BlockModal(props) {
  const { loadID } = props;
  const [state, setState] = useReducer(modReducer, {
    fields: []
  });
  const [modalState, setModalState] = useState({
    visible: false
  });

  async function loadFromDB() {
    const entityReports = await getEntityReports(loadID);
    if (entityReports !== null) {
      setState({
        fields: entityReports
      });
    }
  }

  useEffect(() => {
    if (loadID) {
      loadFromDB();
    }
  }, [loadID]); // eslint-disable-line

  function newReport() {
    setModalState({
      visible: true
    });
  }

  function openReport(obj) {
    setModalState({
      visible: true,
      loadID: obj.id
    });
  }

  function generateField(stateObj, i) {
    return (
      <tr
        key={i}
        className="padding8px hovergrey"
        onClick={() => {
          openReport(stateObj);
        }}
      >
        <td style={{ textAlign: "center" }}>{i + 1}</td>
        <td>{stateObj.reportType}</td>
        <td>{stateObj.reportText}</td>
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
      Active reports
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
              <th style={{ width: "10%", textAlign: "center" }} scope="col">
                #
              </th>
              <th style={{ width: "25%" }} scope="col">
                Type
              </th>
              <th style={{ width: "65%" }} scope="col">
                Text
              </th>
            </tr>
          </thead>
          <tbody>{generateFields()}</tbody>
        </table>
      </div>
    </div>
  );
  const { isShowing, close } = props;
  return isShowing
    ? ReactDOM.createPortal(
      <Modal isOpen style={{ marginTop: "88px" }} className="modal-lg">
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>
          {message}
          {modalState.visible && (
          <ReportModal
            entityId={loadID}
            loadID={modalState.loadID}
            close={() => {
              setModalState({
                visible: false
              });
              loadFromDB();
            }}
          />
          )}
        </ModalBody>
        <ModalFooter>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end"
            }}
          >
            <Button
              color="primary"
              onClick={newReport}
              style={{
                marginRight: "10px"
              }}
            >
              New report
            </Button>
            <Button
              color="danger"
              onClick={() => { close(); }}
            >
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>,
      document.getElementById("modal-root")
    )
    : null;
}

BlockModal.propTypes = {
  loadID: PropTypes.number,
  close: PropTypes.func.isRequired,
  isShowing: PropTypes.bool.isRequired,
};

BlockModal.defaultProps = {
  loadID: null,
};
