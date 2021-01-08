import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

export default function MyDraggableTable(props) {
  const [state, setState] = useState({
    entityName: "",
    hiddenRowExpanded: -99,
    shownRowHidden: -99,
    snapToGrid: null,
    fields: props.fields,
  });

  useEffect(() => {
    setState({
      ...state,
      fields: props.fields,
    });
  }, [props.fields]);

  useEffect(() => {
    if (props.onFieldsChange) {
      if (state.fields != props.fields) {
        props.onFieldsChange(state.fields);
      }
    }
  }, [state.fields]);

  function handleDrag(x, e) {
    // const rowID = e.node.attributes.rowid.value;
    const rowHeight = props.rowHeight;
    const rowID = parseInt(e.node.childNodes[0].attributes.rowid.value);
    const isOverCell = rowID + Math.round(e.lastY / rowHeight);
    if (isOverCell < 0 || isOverCell > state.fields.length - 1) return;
    if (
      isOverCell != state.isOverCell &&
      state.hiddenRowExpanded != isOverCell
    ) {
      setState({
        ...state,
        draggedRow: rowID,
        isOverCell: isOverCell,
        hiddenRowExpanded: isOverCell != rowID ? isOverCell : -99,
        shownRowHidden: isOverCell != rowID ? rowID : -99,
        direction: isOverCell < rowID ? "up" : "down",
        snapToGrid: null,
        lastDraggableState: state.resetDraggable,
      });
    }
  }

  function onDragEnd() {
    setState({
      ...state,
      snapToGrid: {
        x: 0,
        y: (state.isOverCell - state.draggedRow) * 55,
      },
    });
    setTimeout(() => {
      setState({
        ...state,
        fields: moveArrayElement(
          state.fields,
          state.draggedRow,
          state.isOverCell
        ),
        draggedRow: null,
        isOverCell: null,
        hiddenRowExpanded: -99,
        shownRowHidden: -99,
        direction: null,
        snapToGrid: null,
        resetDraggable: !state.resetDraggable,
        lastDraggableState: state.resetDraggable,
      });
    }, props.transitionSpeed);
  }

  function moveArrayElement(arrayIn, fromIndex, toIndex) {
    const newRows = [...arrayIn];
    newRows.splice(toIndex, 0, newRows.splice(fromIndex, 1)[0]);
    return newRows;
  }

  function generateField(stateObj, i) {
    let trans =
      state.draggedRow == i && state.snapToGrid != null
        ? "transform " + props.transitionSpeed + "ms"
        : "transform 0s";
    return (
      <Draggable
        onDrag={handleDrag}
        onStop={onDragEnd}
        position={state.draggedRow == i ? state.snapToGrid : null}
        handle=".handle"
        key={state.resetDraggable ? "reset" + i : i}
      >
        <div
          className="handle"
          style={{
            top:
              state.shownRowHidden == i
                ? state.direction == "up"
                  ? -props.rowHeight
                  : "0"
                : "0", //this is hacky but works well
            transition:
              "height " +
              props.transitionSpeed +
              "ms, top " +
              props.transitionSpeed +
              "ms," +
              trans,
            position: "relative",
            height: state.shownRowHidden == i ? "0" : props.rowHeight, //this is hacky but works well
          }}
        >
          <div
            key={i}
            className="padding8px myTr paintMeDrag"
            rowid={i}
            style={{
              position: "relative",
              backgroundColor: "white",
              display: "flex",
              cursor: "move",
              width: "100%",
            }}
          >
            {props.showRowCount && (
              <div
                className="myTd"
                style={{
                  width: "7%",
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  padding: "8px",
                  cursor: "move",
                  borderRight: "1px solid #dee2e6",
                }}
              >
                {i + 1}
              </div>
            )}
            {props.tableRows[i]}
          </div>
        </div>
      </Draggable>
    );
  }

  function calcHeight(i) {
    if (state.direction == undefined) return "0";
    if (state.direction == "up") {
      if (state.hiddenRowExpanded == i) {
        return props.rowHeight;
      } else {
        return "0";
      }
    } else {
      if (state.hiddenRowExpanded + 1 == i) {
        return props.rowHeight;
      } else {
        return "0";
      }
    }
  }
  function generateFields() {
    let fieldsHTML = [];
    fieldsHTML.push(
      <div
        key={"fake0"}
        id={"fake0"}
        className="myTr"
        style={{
          transition:
            state.lastDraggableState != state.resetDraggable
              ? "height 0s"
              : "height " + props.transitionSpeed + "ms",
          padding: "0px",
          margin: "0px",
          lineHeight: "0",
          width: "100%",
          //border:"1px solid #dee2e6",
          overflow: "hidden",
          height: calcHeight(0),
        }}
      >
        <div
          className="myTd"
          colSpan={3}
          style={{
            lineHeight: "0",
            width: "100%",
            padding: "0px",
            margin: "0px",
            border: "0px solid blue",
            overflow: "hidden",
            height: "0",
          }}
        ></div>
      </div>
    );
    for (let i = 0; i < state.fields.length; i++) {
      fieldsHTML.push(generateField(state.fields[i], i));
      fieldsHTML.push(
        <div
          key={"fake" + (i + 1)}
          id={"fake" + (i + 1)}
          className="myTr"
          style={{
            transition:
              state.lastDraggableState != state.resetDraggable
                ? "height 0s"
                : "height " + props.transitionSpeed + "ms",
            padding: "0px",
            margin: "0px",
            lineHeight: "0",
            width: "100%",
            //border:"1px solid #dee2e6",
            overflow: "hidden",
            height: calcHeight(i + 1),
          }}
        >
          <div
            className="myTd"
            colSpan={3}
            style={{
              lineHeight: "0",
              width: "100%",
              padding: "0px",
              margin: "0px",
              border: "0px solid blue",
              overflow: "hidden",
              height: "0",
            }}
          ></div>
        </div>
      );
    }
    return fieldsHTML;
  }
  const html = generateFields();
  return html;
}
