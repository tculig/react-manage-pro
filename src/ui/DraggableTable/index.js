import React, { useState } from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";

export default function MyDraggableTable(props) {
  const {
    onChange,
    rowHeight,
    transitionSpeed,
    showRowCount,
    tableRows,
  } = props;
  console.log(tableRows);
  const [state, setState] = useState({
    hiddenRowExpanded: -99,
    shownRowHidden: -99,
    snapToGrid: null,
    resetDraggable: false,
    lastDraggableState: false,
    draggedRow: null,
    direction: null,
    isOverCell: null,
  });

  function handleDrag(x, e) {
    const rowID = parseInt(e.node.childNodes[0].attributes.rowid.value, 10);
    const isOverCell = rowID + Math.round(e.lastY / rowHeight);
    if (isOverCell < 0 || isOverCell > tableRows.length - 1) return;
    if (
      isOverCell !== state.isOverCell
      && state.hiddenRowExpanded !== isOverCell
    ) {
      setState({
        ...state,
        draggedRow: rowID,
        isOverCell,
        hiddenRowExpanded: isOverCell !== rowID ? isOverCell : -99,
        shownRowHidden: isOverCell !== rowID ? rowID : -99,
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
        draggedRow: null,
        isOverCell: null,
        hiddenRowExpanded: -99,
        shownRowHidden: -99,
        direction: null,
        snapToGrid: null,
        resetDraggable: !state.resetDraggable,
        lastDraggableState: state.resetDraggable,
      });
      onChange();
    }, transitionSpeed);
  }

  function generateField(i) {
    const trans = (state.draggedRow === i && state.snapToGrid !== null
      ? `transform ${transitionSpeed}ms`
      : "transform 0s");
    return (
      <Draggable
        onDrag={handleDrag}
        onStop={onDragEnd}
        position={state.draggedRow === i ? state.snapToGrid : null}
        handle=".handle"
        key={state.resetDraggable ? `reset${i}` : i}
      >
        <div
          className="handle"
          style={{
            top:
              state.shownRowHidden === i
                ? state.direction === "up"
                  ? -rowHeight
                  : "0"
                : "0", // this is hacky but works well
            transition: `height ${transitionSpeed}ms, top ${transitionSpeed}ms,${trans}`,
            position: "relative",
            height: state.shownRowHidden === i ? "0" : rowHeight, // this is hacky but works well
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
            {showRowCount && (
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
            {tableRows[i]}
          </div>
        </div>
      </Draggable>
    );
  }

  function calcHeight(i) {
    if (state.direction === undefined) return "0";
    if (state.direction === "up") {
      if (state.hiddenRowExpanded === i) {
        return props.rowHeight;
      }
      return "0";
    }
    if (state.hiddenRowExpanded + 1 === i) {
      return props.rowHeight;
    }
    return "0";
  }

  function generateFields() {
    const fieldsHTML = [];
    fieldsHTML.push(
      <div
        key="fake0"
        id="fake0"
        className="myTr"
        style={{
          transition:
            state.lastDraggableState !== state.resetDraggable
              ? "height 0s"
              : `height ${transitionSpeed}ms`,
          padding: "0px",
          margin: "0px",
          lineHeight: "0",
          width: "100%",
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
        />
      </div>
    );
    for (let i = 0; i < tableRows.length; i++) {
      fieldsHTML.push(generateField(i));
      fieldsHTML.push(
        <div
          key={`fake${(i + 1)}`}
          id={`fake${(i + 1)}`}
          className="myTr"
          style={{
            transition:
              state.lastDraggableState !== state.resetDraggable
                ? "height 0s"
                : `height ${transitionSpeed}ms`,
            padding: "0px",
            margin: "0px",
            lineHeight: "0",
            width: "100%",
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
          />
        </div>
      );
    }
    return fieldsHTML;
  }
  const html = generateFields();
  return html;
}

MyDraggableTable.propTypes = {
  transitionSpeed: PropTypes.number,
  rowHeight: PropTypes.number,
  showRowCount: PropTypes.bool,
  tableRows: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
};

MyDraggableTable.defaultProps = {
  transitionSpeed: 600,
  rowHeight: 55,
  showRowCount: true,
  tableRows: []
};
