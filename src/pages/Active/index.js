import React, { useEffect, useState } from "react";
import { Container, FormGroup, Input, Label, Table } from "reactstrap";
import * as dbCalls from "../../databaseCalls/dbCalls";
import { ReportTypes } from "../../Dialogs/ReportTypes";

export default function TablicaRoot(props) {
  const [state, setState] = useState({
    checkboxes: (() => {
      let array = [];
      Object.keys(ReportTypes).map(function (key, index) {
        array.push({
          id: key,
          checked: false,
          kategorija: ReportTypes[key],
        });
      });
      return array;
    })(),
    // {id:"id1",checked:false,kategorija:"Breakdown"}
    tablicaContent: [],
    modalChildren: [],
  });

  function showData(data) {
    setState({
      ...state,
      tablicaContent: data,
    });
  }

  useEffect(() => {
    dbCalls.getReports(state.checkboxes, "hsvisum", "reports", showData);
  }, [state.checkboxes]);

  function toggleCheckbox(e) {
    const id = e.target.id;
    setState({
      ...state,
      checkboxes: state.checkboxes.map((obj) => {
        if (obj.id == id) {
          return {
            ...obj,
            checked: !obj.checked,
          };
        } else {
          return obj;
        }
      }),
    });
  }
  function showPrijava(f) {
    console.log(f);
  }
  function generateTablica() {
    let counter = 0;
    let tablicaHTML = state.tablicaContent.map((f) => {
      counter++;
      return (
        <tr
          key={f.id}
          className="rukica hovergrey"
          onClick={() => {
            showPrijava(f);
          }}
        >
          <td>{counter}</td>
          <td>{f.entityName}</td>
          <td>{f.entityTable}</td>
          <td>{f.reportType}</td>
          <td style={{ textAlign: "left" }}>{f.reportText}</td>
        </tr>
      );
    });
    return tablicaHTML;
  }

  let generatedCheckboxes = [];
  for (let i = 0; i < state.checkboxes.length; i++) {
    generatedCheckboxes.push(
      <FormGroup
        check
        inline
        style={{ paddingLeft: "6px", paddingRight: "6px", margin: "10px" }}
        key={state.checkboxes[i].id}
      >
        <Label check>
          <Input
            type="checkbox"
            id={state.checkboxes[i].id}
            checked={state.checkboxes[i].checked}
            onChange={toggleCheckbox}
          />{" "}
          {state.checkboxes[i].kategorija}
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
                    {generatedCheckboxes}
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      textAlign: "right",
                      border: "0px solid red",
                    }}
                  ></div>
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
      >
        {state.modalChildren}
      </div>
    </div>
  );
}
