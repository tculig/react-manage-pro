import React, { useReducer } from "react";
import { useDispatch } from "react-redux";
import GridLayout from "react-grid-layout";
import PropTypes from "prop-types";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ColorEditor from "../ColorEditor";
import { changeColorRedux, commitLayoutToDBRedux } from "../../redux/templatesSlice";
import { modReducer } from "../../utils";

/* eslint-disable */
export default function Gridlet(props) {
  const dispatch = useDispatch();
  const { layout, cols, rows, scale, width, height, name, level, showColorEditor, showFontEditor } = props;
  const rowHeight = height / rows;
  const scaleFactor = 1;
  const layoutCurrent =  layout.filter((el)=>{return el.parent===name});
  const [state] = useReducer(modReducer, {
    showColorEditorState: showColorEditor,
    showFontEditorState: showFontEditor
  });


  function updateElementColor(gridletName, color) {
    dispatch(changeColorRedux({gridletName, color}));
  }

  function commitLayoutToDB() {
    dispatch(commitLayoutToDBRedux());
  }

  function cancelColorChange() {
    console.log("cancel");
  }

  function makeGrid(el) {
    return (
      <div key={el.i} style={{ 
        border: "1px solid black",
        backgroundColor: el.bgcolor
      }}>
        <Gridlet
          name={el.i}
          level={level + 1}
          scale={scale / scaleFactor}
          cols={scaleFactor * el.w}
          maxRows={scaleFactor * el.h}
          width={(scaleFactor * width * el.w) / cols}
          height={(scaleFactor * height * el.h) / rows}
          layout={layout}
        />
      </div>
    );
  }

  const { showColorEditorState, showFontEditorState } = state;
  const templateGridletName = layoutCurrent[0]?.i;
  const templateGridletColor = layoutCurrent[0]?.bgcolor;

  return (
    <div style={{ position:"relative" }}>
      { showColorEditorState && 
      <ColorEditor
        onChange={updateElementColor}
        onCommit={commitLayoutToDB}
        onCommitCancel={cancelColorChange}
        gridletName={templateGridletName}
        color={templateGridletColor || undefined}
      />
      }
      <GridLayout
        layout={layout}
        cols={cols}
        compactType={null}
        preventCollision
        transformScale={scale}
        width={width}
        onMouseDown={(e) => { e.stopPropagation(); }}
        rowHeight={rowHeight}
        containerPadding={[0, 0, 0, 0]}
        margin={[0, 0]}
        maxRows={rows}
        stretchContainer
        name={name}
        showPlaceholder={false}
      >
        {layoutCurrent.map((el) => { return makeGrid(el); })}
      </GridLayout>
    </div>
  );
}

Gridlet.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  layout: PropTypes.arrayOf(PropTypes.object).isRequired,
  scale: PropTypes.number,
  cols: PropTypes.number,
  rows: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  showColorEditor: PropTypes.bool,
  showFontEditor: PropTypes.bool
};

Gridlet.defaultProps = {
  scale: 1,
  cols: 100,
  rows: 100,
  width: 1000,
  height: 1000,
  showColorEditor: false,
  showFontEditor: false
};
