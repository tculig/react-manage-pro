import React, { useEffect, useReducer, useState } from "react";
import { Container, FormGroup, Input, Label, Table } from "reactstrap";
import { getReportsByType, getReportTypes } from "./dbcalls";
import { modReducer } from "../../utils";
import ReportModal from "../../modals/ReportModal";
import "./style.scss";

export default function TablicaRoot() {
  const [state, setState] = useReducer(modReducer, {
    reportTypeCheckboxes: [],
    showingReports: [],
  });
  const [modalState, setModalState] = useState({
    visible: false
  });

  useEffect(() => {
    async function fillReportTypes() {
      let reportTypes = await getReportTypes();
      reportTypes = reportTypes.map((el) => {
        el.checked = false;
        return el;
      });
      setState({
        reportTypeCheckboxes: reportTypes,
      });
    }
    fillReportTypes();
  }, []);

  async function getReportsForTypes(reportTypeCheckboxes) {
    const reports = await getReportsByType(reportTypeCheckboxes);
    setState({
      showingReports: reports,
    });
  }

  useEffect(() => {
    if (state.reportTypeCheckboxes.length > 0) {
      getReportsForTypes(state.reportTypeCheckboxes);
    }
  }, [state.reportTypeCheckboxes]);

  function toggleCheckbox(e) {
    const id = parseInt(e.target.id, 10);
    setState({
      reportTypeCheckboxes: state.reportTypeCheckboxes.map((obj) => {
        if (obj.id === id) {
          return {
            ...obj,
            checked: !obj.checked,
          };
        }
        return obj;
      }),
    });
  }

  function openReport(id) {
    setModalState({
      visible: true,
      loadID: id
    });
  }

  function generateTablica() {
    let counter = 0;
    const tablicaHTML = state.showingReports.map((f) => {
      counter++;
      return (
        <tr
          key={f.id}
          className="rukica hovergrey"
          onClick={() => {
            openReport(f.id);
          }}
        >
          <td>{counter}</td>
          <td>{f.entityName}</td>
          <td>{f.entityType}</td>
          <td>{f.reportTypeName}</td>
          <td style={{ textAlign: "center" }}>{f.reportText}</td>
        </tr>
      );
    });
    return tablicaHTML;
  }

  function generateCheckbox(el) {
    return (
      <FormGroup
        check
        inline
        style={{ paddingLeft: "6px", paddingRight: "6px", margin: "10px" }}
        key={el.id}
      >
        <Label check>
          <Input
            type="checkbox"
            id={el.id}
            checked={el.checked}
            onChange={toggleCheckbox}
          />
          {" "}
          {el.name}
        </Label>
      </FormGroup>
    );
  }

  return (
    <div
      style={{
        height: "calc(100vh - 56px)",
        transition: "all 0.2s",
        padding: "8px",
        marginTop: "56px",
      }}
    >
      <div className="rasporedi" style={{ paddingTop: "10px" }}>
        <table className="testtab">
          <tbody>
            <tr>
              <td>
                <Container
                  className="TitiContainer maloGoreDole"
                  style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    backgroundColor: "#D3D3D3",
                    textAlign: "left",
                    marginTop: "20px",
                    fontSize: "1rem",
                  }}
                >
                  <FormGroup
                    check
                    inline
                    style={{
                      paddingLeft: "16px",
                      paddingRight: "0px",
                      display: "inline-block",
                    }}
                  >
                    <Label>Show:</Label>
                  </FormGroup>
                  <div style={{ display: "inline-block" }}>
                    {state.reportTypeCheckboxes.map((el) => generateCheckbox(el))}
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      textAlign: "right",
                      border: "0px solid red",
                    }}
                  />
                </Container>
                <Container
                  className="TitiContainer maloGoreDole"
                  style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    backgroundColor: "#EEEEEE",
                    textAlign: "center",
                    marginTop: "20px",
                    fontSize: "1rem",
                    overflow: "auto",
                    maxHeight: window.innerHeight - 200,
                  }}
                >
                  <Table striped className="tablica">
                    <thead>
                      <tr>
                        <th style={{ width: "5%" }}>#</th>
                        <th style={{ width: "15%" }}>Entity name</th>
                        <th style={{ width: "15%" }}>Entity type</th>
                        <th style={{ width: "15%" }}>Report type</th>
                        <th style={{ width: "50%" }}>Report text</th>
                      </tr>
                    </thead>
                    <tbody>{generateTablica()}</tbody>
                  </Table>
                </Container>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        className="modal-footer"
        style={{ display: "flex", justifyContent: "center" }}
      />
      {modalState.visible && (
      <ReportModal
        loadID={modalState.loadID}
        close={() => {
          setModalState({
            visible: false
          });
          getReportsForTypes();
        }}
      />
      )}
    </div>
  );
}
