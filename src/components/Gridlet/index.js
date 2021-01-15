import React, { useReducer } from "react";
import { useDispatch } from "react-redux";
import GridLayout from "react-grid-layout";
import { Menu, Item, Separator, Submenu, useContextMenu } from "react-contexify";
import PropTypes from "prop-types";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ColorEditor from "../ColorEditor";
import FontEditor from "../FontEditor";
import ActiveFieldsEditor from "../ActiveFieldsEditor";
import { changeAttributeRedux, commitLayoutToDBRedux } from "../../redux/layoutSlice";
import { modReducer } from "../../utils";
import "react-contexify/dist/ReactContexify.css";

/* eslint-disable */
export default function Gridlet(props) {
  const dispatch = useDispatch();
  const { layout, cols, rows, scale, width, height, name, level, showColorEditor, showFontEditor, showActiveFieldsEditor, parentLayoutElement } = props;
  const rowHeight = height / rows;
  const scaleFactor = 1;
  const layoutCurrent = layout.filter((el) => { return el.parent === name; });
  const layoutElement = layoutCurrent[0];
  const layoutElementFontConfiguration = layoutCurrent[0]?.fontConfiguration;
  const layoutElementEntityDataConfiguration = layoutCurrent[0]?.entityDataConfiguration;
  const layoutElementEntityTypeId = layoutCurrent[0]?.entityTypeId;
  const layoutElementGridletId = layoutCurrent[0]?.gridletId;
  const layoutElementGridletColor = layoutCurrent[0]?.bgcolor;
  
  const [state] = useReducer(modReducer, {
    showColorEditorState: showColorEditor,
    showFontEditorState: showFontEditor,
    showActiveFieldsEditorState: showActiveFieldsEditor,
  });

  function updateElementColor(color) {
    dispatch(
      changeAttributeRedux({
        gridletId: layoutGridletId,
        value: { bgcolor: color },
      })
    );
  }

  function updateReduxFontConfiguration(updatedAttribute) {
    if (layoutElement !== undefined) {
      const newFontConfiguration = {
        ...layoutElementFontConfiguration,
        ...updatedAttribute,
      };
      dispatch(
        changeAttributeRedux({
          gridletId: layoutElementGridletId,
          value: { fontConfiguration: newFontConfiguration },
        })
      );
    }
  }
  function updateReduxElement(updatedAttribute) {
    if (layoutElement !== undefined) {
      dispatch(
        changeAttributeRedux({
          gridletId: layoutElementGridletId,
          value: updatedAttribute,
        })
      );
    }
  }
  function updateLayout(newElementData) {
    dispatch(
      changeAttributeRedux({
        gridletId: parseInt(newElementData.i),
        value: { 
          x: newElementData.x,
          y: newElementData.y,
          w: newElementData.w,
          h: newElementData.h
         },
      })
    );
  }

  function commitLayoutToDB() {
    dispatch(commitLayoutToDBRedux());
  }

  function cancelLayoutChange() {
    console.log("cancel");
  }

  function makeGrid(el) {
    return (
      <div
        data-grid={{
          ...el,
          i: el.gridletId.toString()
        }}
        key={el.gridletId.toString()}
        style={{
          border: "2px solid black",
          borderRadius: "12px",
          backgroundColor: el.bgcolor,
        }}
      >
        <Gridlet
          name={el.gridletId.toString()}
          level={level + 1}
          scale={scale / scaleFactor}
          cols={scaleFactor * el.w}
          maxRows={scaleFactor * el.h}
          width={(scaleFactor * width * el.w) / cols}
          height={(scaleFactor * height * el.h) / rows}
          layout={layout}
          parentLayoutElement={el}
        />
      </div>
    );
  }

  const {
    showColorEditorState,
    showFontEditorState,
    showActiveFieldsEditorState,
  } = state;

  const { show } = useContextMenu({
    id: "contextMenu"
  });

  const contextMenu = (
    <Menu id="contextMenu">
      <Item>Item 1</Item>
      <Item>Item 2</Item>
      <Separator />
      <Item disabled>Disabled</Item>
      <Separator />
      <Submenu label="Submenu">
        <Item>Sub Item 1</Item>
        <Item>Sub Item 2</Item>
      </Submenu>
    </Menu>
  );

  return (
    <div style={{ position: "relative" }}>
      {showColorEditorState && (
        <ColorEditor
          onChange={updateElementColor}
          onCommit={commitLayoutToDB}
          onCommitCancel={cancelLayoutChange}
          positionOffset={{ x: 6, y: 6 }}
          scale={0.8}
          color={layoutElementGridletColor || undefined}
        />
      )}
      {showFontEditorState && (
        <FontEditor
          onChange={(updatedAttribute) => {
            updateReduxFontConfiguration(updatedAttribute);
          }}
          onCommit={commitLayoutToDB}
          onCommitCancel={cancelLayoutChange}
          positionOffset={{ x: 6, y: 324 }}
          scale={0.8}
          {...layoutElementFontConfiguration}
        />
      )}
      {showActiveFieldsEditorState && (
        <ActiveFieldsEditor
          onChange={(updatedAttribute) => {
            updateReduxElement(updatedAttribute);
          }}
          onCommit={commitLayoutToDB}
          onCommitCancel={cancelLayoutChange}
          positionOffset={{ x: 6, y: 6 }}
          entityDataConfiguration={layoutElementEntityDataConfiguration}
          entityTypeId={layoutElementEntityTypeId}
          entityTypeName={ layoutElementEntityDataConfiguration ? layoutElementEntityDataConfiguration[0]?.name: "" }
          right={"20px"}
          top={"100px"}
        />
      )}
      { layoutCurrent.length > 0 ? 
      (
        <div 
        onContextMenu={show}
        style={{border:"0px solid pink"}}>
          <GridLayout
            cols={cols}
            compactType={null}
            preventCollision
            transformScale={scale}
            width={width}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            rowHeight={rowHeight}
            onDragStop={(layout, oldDragItem, l, bnull, e, node) => { updateLayout(l); }}
            onResizeStop={(layout, oldResizeItem, l, placeholder, e, node) => { updateLayout(l); }}
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
      ) :
      <div style={{
        display: "flex",
        flexDirection: "column",
        color: layoutElementGridletColor,
        ...parentLayoutElement?.fontConfiguration
      }}>
        {parentLayoutElement && parentLayoutElement.entityDataConfiguration.map(el => el.checked ? (<div key={ el.id }>{el.property_name}</div>): null)}
      </div>
      }
      {contextMenu}
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
  showActiveFieldsEditor: PropTypes.bool,
  parentLayoutElement: PropTypes.shape({
    i: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    w: PropTypes.number,
    h: PropTypes.number
  }),
};

Gridlet.defaultProps = {
  scale: 1,
  cols: 100,
  rows: 100,
  width: 1000,
  height: 1000,
  showColorEditor: false,
  showFontEditor: false,
  showActiveFieldsEditor: false,
  parentLayoutElement: null
};
