import PropTypes from "prop-types";
import React, { useEffect, useReducer } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, Input, Label, FormGroup } from "reactstrap";
import ReactDOM from "react-dom";
import { modReducer, getToday } from "../../utils";
import { getReportById, createNewReport, updateReport, getReportTypes } from "./dbcalls";
import "./style.scss";

export default function ReportModal(props) {
  const { loadID, entityId } = props;
  const existingReport = !!loadID;
  const [state, setState] = useReducer(modReducer, {
    reportType: null,
    reportTypesAvailable: [],
    reportText: "",
  });

  useEffect(() => {
    async function loadFromDB() {
      const reportDetails = await getReportById(loadID);
      if (reportDetails !== null) {
        setState({
          reportType: reportDetails.reportType,
          reportText: reportDetails.reportText,
        });
      }
    }

    async function getReportTypesDB() {
      const reportTypes = await getReportTypes(loadID);
      if (reportTypes !== null) {
        setState({
          reportTypesAvailable: reportTypes,
        });
      }
      if (loadID) {
        loadFromDB();
      }
    }
    getReportTypesDB();
  }, [loadID]); // eslint-disable-line

  function saveReportToDB() {
    createNewReport({
      reportType: state.reportType,
      reportText: state.reportText,
      active: 1,
      dateCreated: getToday(),
      entityId,
    });
  }
  function updateReportDB() {
    updateReport({
      ...state,
      id: loadID,
    });
  }
  function dismissReportDB() {
    updateReport({
      active: 0,
      id: loadID,
    });
  }

  function handleRadioChange(changeEvent) {
    setState({
      reportType: changeEvent.target.id,
    });
  }

  function inputHandler(e) {
    e.stopPropagation();
    setState({
      reportText: e.target.value,
    });
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
      New report
    </div>
  );

  function generateReportTypeInput(el) {
    return (
      <CustomInput
        key={el.id}
        type="radio"
        id={el.id}
        name="customRadio"
        label={el.name}
        checked={state.reportType === el.id}
        onChange={handleRadioChange}
      />
    );
  }

  const message = (
    <>
      <FormGroup>
        <Label for="reportTypeRadios" style={{ textDecoration: "underline" }}>
          Report type
        </Label>
        <div
          id="reportTypeRadios"
          style={{
            paddingTop: "18px",
            display: "flex",
            justifyContent: "space-evenly",
            borderBottom: "1px solid lightgrey",
            paddingBottom: "18px",
            //  borderRadius:"4px"
          }}
        >
          {state.reportTypesAvailable.map((el) => generateReportTypeInput(el))}
        </div>
      </FormGroup>
      <FormGroup>
        <Label for="exampleText">Report text:</Label>
        <Input
          type="textarea"
          name="text"
          id="exampleText"
          rows={6}
          onChange={inputHandler}
          value={state.reportText}
        />
      </FormGroup>
    </>
  );
  const { isShowing, close } = props;
  return isShowing
    ? ReactDOM.createPortal(
      <Modal isOpen style={{ marginTop: "88px" }}>
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            {existingReport ? (
              <>
                <Button
                  color="primary"
                  onClick={() => {
                    dismissReportDB();
                    close();
                  }}
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Dismiss report
                </Button>
                <Button
                  color="success"
                  onClick={() => {
                    updateReportDB();
                    close();
                  }}
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Update
                </Button>
                <Button color="danger" onClick={close}>
                  Close
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="success"
                  onClick={() => {
                    saveReportToDB();
                    close();
                  }}
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Submit
                </Button>
                <Button color="danger" onClick={close}>
                  Close
                </Button>
              </>
            )}
          </div>
        </ModalFooter>
      </Modal>,
      document.getElementById("modal-root")
    )
    : null;
}

ReportModal.propTypes = {
  loadID: PropTypes.number,
  close: PropTypes.func.isRequired,
  isShowing: PropTypes.bool,
  entityId: PropTypes.number.isRequired
};

ReportModal.defaultProps = {
  loadID: null,
  isShowing: true
};
