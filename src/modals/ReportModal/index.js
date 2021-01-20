import PropTypes from "prop-types";
import React, { useEffect, useReducer } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, Input, Label, FormGroup } from "reactstrap";
import ReactDOM from "react-dom";
import { modReducer } from "../../utils";
import { getReportById } from "./dbcalls";
import { ReportTypes } from "./ReportTypes";
import "./style.scss";

export default function ReportModal(props) {
  const { loadID } = props;
  const [state, setState] = useReducer(modReducer, {
    reportType: "breakdown",
    reportText: ""
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
    if (loadID) {
      loadFromDB();
    }
  }, [loadID]); // eslint-disable-line

  function saveReportToDB() {
    console.log("save");
  }

  function handleRadioChange(changeEvent) {
    setState({
      reportType: changeEvent.target.id
    });
  }

  function inputHandler(e) {
    e.stopPropagation();
    setState({
      reportText: e.target.value
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
          <CustomInput
            type="radio"
            id="breakdown"
            name="customRadio"
            label={ReportTypes.breakdown}
            checked={state.reportType === "breakdown"}
            onChange={handleRadioChange}
          />
          <CustomInput
            type="radio"
            id="service"
            name="customRadio"
            label="Service"
            checked={state.reportType === "service"}
            onChange={handleRadioChange}
          />
          <CustomInput
            type="radio"
            id="toolchange"
            name="customRadio"
            label="Tool change"
            checked={state.reportType === "toolchange"}
            onChange={handleRadioChange}
          />
          <CustomInput
            type="radio"
            id="calibration"
            name="customRadio"
            label="Calibration"
            checked={state.reportType === "calibration"}
            onChange={handleRadioChange}
          />
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
              justifyContent: "flex-end"
            }}
          >
            <Button
              color="success"
              onClick={() => {
                saveReportToDB();
                close();
              }}
              style={{
                marginRight: "10px"
              }}
            >
              Submit
            </Button>
            <Button
              color="danger"
              onClick={close}
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

ReportModal.propTypes = {
  loadID: PropTypes.number,
  close: PropTypes.func.isRequired,
  isShowing: PropTypes.bool.isRequired,
};

ReportModal.defaultProps = {
  loadID: null,
};
