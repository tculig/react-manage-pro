import React, { useReducer } from "react";
import { useDispatch } from "react-redux";
import GridLayout from "react-grid-layout";
import PropTypes from "prop-types";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ColorEditor from "../ColorEditor";
import FontEditor from "../FontEditor";
import ActiveFieldsEditor from "../ActiveFieldsEditor";
import { changeAttributeRedux, commitLayoutToDBRedux } from "../../redux/templatesSlice";
import { modReducer } from "../../utils";

/* eslint-disable */
export default function Gridlet(props) {
  const dispatch = useDispatch();
  const { layout, cols, rows, scale, width, height, name, level, showColorEditor, showFontEditor, showActiveFieldsEditor } = props;
  const rowHeight = height / rows;
  const scaleFactor = 1;
  const layoutCurrent =  layout.filter((el)=>{return el.parent===name});
  const templateElement = layoutCurrent[0];
  const templateFontConfiguration = layoutCurrent[0]?.fontConfiguration;
  const templateEntityDataConfiguration = layoutCurrent[0]?.entityDataConfiguration;
  const templateEntityTypeId = layoutCurrent[0]?.entityTypeId;
  const templateGridletId = layoutCurrent[0]?.gridletId;
  const templateGridletColor = layoutCurrent[0]?.bgcolor;
  const [state] = useReducer(modReducer, {
    showColorEditorState: showColorEditor,
    showFontEditorState: showFontEditor,
    showActiveFieldsEditorState: showActiveFieldsEditor
  });

  function updateElementColor(color) {
    dispatch(changeAttributeRedux({gridletId: templateGridletId, value: { bgcolor: color}}));
  }

  function updateReduxFontConfiguration(updatedAttribute) {
    if(templateElement !== undefined){
      const newFontConfiguration = {
        ...templateFontConfiguration,
        ...updatedAttribute
      }
      dispatch(changeAttributeRedux({gridletId: templateGridletId, value: { fontConfiguration: newFontConfiguration}}));
    }
  }
  function updateReduxElement(updatedAttribute) {
    if(templateElement !== undefined){
      dispatch(changeAttributeRedux({gridletId: templateGridletId, value: updatedAttribute}));
    }
  }

  function commitLayoutToDB() {
    dispatch(commitLayoutToDBRedux());
  }

  function cancelLayoutChange() {
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

  const { showColorEditorState, showFontEditorState, showActiveFieldsEditorState } = state;
 
  return (
    <div style={{ position:"relative" }}>
      { showColorEditorState && 
      <ColorEditor
        onChange={updateElementColor}
        onCommit={commitLayoutToDB}
        onCommitCancel={cancelLayoutChange}
        positionOffset={{x:6,y:6}}
        scale={0.8}
        color={templateGridletColor || undefined}
      />
      }
      { showFontEditorState && 
      <FontEditor
        onChange={(updatedAttribute) => {updateReduxFontConfiguration(updatedAttribute)}}
        onCommit={commitLayoutToDB}
        onCommitCancel={cancelLayoutChange}
        positionOffset={{x:6,y:324}}
        scale={0.8}
        {...templateFontConfiguration}
      />
      }
      { showActiveFieldsEditorState && 
      <ActiveFieldsEditor
        onChange={(updatedAttribute) => {updateReduxElement(updatedAttribute)}}
        onCommit={commitLayoutToDB}
        onCommitCancel={cancelLayoutChange}
        positionOffset={{x:6,y:6}}
        entityDataConfiguration={templateEntityDataConfiguration}
        entityTypeId={templateEntityTypeId}
        entityTypeName={templateEntityDataConfiguration ? templateEntityDataConfiguration[0]?.name : ""}
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
  showFontEditor: PropTypes.bool,
  showActiveFieldsEditor: PropTypes.bool
};

Gridlet.defaultProps = {
  scale: 1,
  cols: 100,
  rows: 100,
  width: 1000,
  height: 1000,
  showColorEditor: false,
  showFontEditor: false,
  showActiveFieldsEditor: false
};
