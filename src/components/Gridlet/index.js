import React, { useReducer, useContext, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import GridLayout from "react-grid-layout";
import { Menu, Item, Submenu, useContextMenu } from "react-contexify";
import PropTypes from "prop-types";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ColorEditor from "../ColorEditor";
import FontEditor from "../FontEditor";
import ActiveFieldsEditor from "../ActiveFieldsEditor";
import { changeAttributeRedux, commitLayoutToDBRedux, selectLayoutId } from "../../redux/layoutSlice";
import { modReducer } from "../../utils";
import "react-contexify/dist/ReactContexify.css";
import { createBlockDB, connectEntityToBlockDB } from "./dbcalls";
import { MainContext } from "../../pages/Main/HomeView";
import BlockModal from "../../modals/BlockModal";
import "./style.scss";

export default function Gridlet(props) {
  const dispatch = useDispatch();
  const mainContext = useContext(MainContext);
  const [dropGlowing, setDropGlowing] = useState(-1);
  const {
    layout, cols, rows, scale, width, height, name, level, customContextMenu,
    availableTemplates, showColorEditor, showFontEditor, showActiveFieldsEditor
  } = props;
  const rowHeight = height / rows;
  const colHeight = width / cols;
  const scaleFactor = 1;
  const layoutCurrent = layout.filter((el) => { return el.parent === name; });
  const layoutElement = layoutCurrent[0];
  const layoutElementFontConfiguration = layoutCurrent[0]?.fontConfiguration;
  const layoutElementEntityDataConfiguration = layoutCurrent[0]?.entityDataConfiguration;
  const layoutElementEntityTypeId = layoutCurrent[0]?.entityTypeId;
  const layoutElementGridletId = layoutCurrent[0]?.id;
  const layoutElementGridletColor = layoutCurrent[0]?.bgcolor;
  const [state] = useReducer(modReducer, {
    showColorEditorState: showColorEditor,
    showFontEditorState: showFontEditor,
    showActiveFieldsEditorState: showActiveFieldsEditor,
  });
  const [blockModalState, setBlockModalState] = useState({
    showing: false,
    loadID: null
  });
  const blockMoved = useRef(false);

  function updateElementColor(color) {
    dispatch(
      changeAttributeRedux({
        id: layoutElementGridletId,
        value: { bgcolor: color },
      })
    );
  }

  function commitLayoutToDB() {
    dispatch(commitLayoutToDBRedux());
  }

  function updateReduxFontConfiguration(updatedAttribute) {
    if (layoutElement !== undefined) {
      const newFontConfiguration = {
        ...layoutElementFontConfiguration,
        ...updatedAttribute,
      };
      dispatch(
        changeAttributeRedux({
          id: layoutElementGridletId,
          value: { fontConfiguration: newFontConfiguration },
        })
      );
      commitLayoutToDB();
    }
  }
  function updateReduxElement(updatedAttribute) {
    if (layoutElement !== undefined) {
      dispatch(
        changeAttributeRedux({
          id: layoutElementGridletId,
          value: updatedAttribute,
        })
      );
      commitLayoutToDB();
    }
  }
  function updateLayout(newElementData) {
    blockMoved.current = true;
    dispatch(
      changeAttributeRedux({
        id: parseInt(newElementData.i, 10),
        value: {
          x: newElementData.x,
          y: newElementData.y,
          w: newElementData.w,
          h: newElementData.h
        },
      })
    );
    commitLayoutToDB();
  }

  function cancelLayoutChange() {
    console.log("cancel");
  }

  async function takeDrop(blockId, e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("Text");
    const received = JSON.parse(data);
    await connectEntityToBlockDB(blockId, received.entityID);
    mainContext.reloadLayout();
  }

  function glowDrop(id, isActive) {
    if (isActive) {
      setDropGlowing(id);
    } else {
      setDropGlowing(-1);
    }
  }

  function openReportModal(el) {
    setBlockModalState({
      showing: true,
      loadID: el.entity_id
    });
  }

  function makeGrid(el) {
    let middle;
    let shadow = {};
    const additionalClasses = [];
    if (el.hasEntity) {
      additionalClasses.push("rukica");
      additionalClasses.push("hovershadow");
    }
    if (el.hasReports) {
      additionalClasses.push("reddot");
    }
    if (el.id === dropGlowing) {
      shadow = {
        boxShadow: "0px 0px 20px 8px royalblue"
      };
    }
    switch (el.type) {
      case "block":
        middle = (
          <div
            onDrop={(e) => {
              takeDrop(el.id, e);
              glowDrop(el.id, false);
            }}
            onDragOver={
              (e) => {
                e.preventDefault();
                e.stopPropagation();
              }
            }
            onClick={() => {
              if (el.hasEntity && !blockMoved.current) { // don't open the modal if the block has been dragged inside the grid
                openReportModal(el);
              }
            }}
            onMouseDown={() => { blockMoved.current = false; }}
            onDragEnter={() => glowDrop(el.id, true)}
            onDragLeave={() => glowDrop(el.id, false)}
            key={el.id.toString()}
            style={{
              height: "100%",
              color: layoutElementGridletColor,
              ...el.fontConfiguration,
              ...shadow
            }}
            className={additionalClasses.join(" ")}
          >
            {el.entityDataConfiguration.map(elEDC => (
              elEDC.checked ? (
                <div
                  key={elEDC.id}
                  style={{
                    pointerEvents: "none"
                  }}
                >
                  {elEDC.value}
                </div>
              ) : null))}
          </div>
        );
        break;
      case "gridlet":
        middle = (
          <Gridlet
            name={el.id.toString()}
            level={level + 1}
            scale={scale / scaleFactor}
            cols={scaleFactor * el.w}
            maxRows={scaleFactor * el.h}
            width={(scaleFactor * width * el.w) / cols}
            height={(scaleFactor * height * el.h) / rows}
            layout={layout}
            parentLayoutElement={el}
          />
        );
        break;
      default: middle = (<div key={el.id.toString()} />);
    }
    return (
      <div
        data-grid={{
          ...el,
          i: el.id.toString(),
        }}
        key={el.id.toString()}
        style={{
          border: "2px solid black",
          borderRadius: "12px",
          backgroundColor: el.bgcolor,
        }}
      >
        {middle}
      </div>
    );
  }

  const layoutId = useSelector(selectLayoutId);
  async function addBlock(templateId, gridletName, e) {
    const event = e.triggerEvent;
    const xPos = Math.round(event.offsetX / rowHeight);
    const yPos = Math.round(event.offsetY / colHeight);
    const newLayoutElement = {
      id: null,
      parent: gridletName,
      x: xPos,
      y: yPos,
      static: 0
    };
    await createBlockDB(templateId, layoutId, newLayoutElement);
    mainContext.reloadLayout();
  }

  const { show } = useContextMenu({
    id: "contextMenu"
  });

  const contextMenu = (
    <Menu id="contextMenu">
      <Submenu label="Insert template">
        {availableTemplates.map(el => {
          return <Item key={el.name} onClick={(e) => addBlock(el.id, name, e)}>{el.name}</Item>;
        })}
      </Submenu>
    </Menu>
  );

  const {
    showColorEditorState,
    showFontEditorState,
    showActiveFieldsEditorState,
  } = state;

  return (
    <div style={{ position: "relative" }}>
      {showColorEditorState && (
        <ColorEditor
          onChange={(color) => {
            updateElementColor(color);
          }}
          onCommit={commitLayoutToDB}
          onCommitCancel={cancelLayoutChange}
          positionOffset={{ x: 6, y: 6 }}
          scale={1.2}
          color={layoutElementGridletColor || undefined}
        />
      )}
      {showFontEditorState && (
        <FontEditor
          onChange={(updatedAttribute) => {
            updateReduxFontConfiguration(updatedAttribute);
            commitLayoutToDB();
          }}
          onCommit={commitLayoutToDB}
          onCommitCancel={cancelLayoutChange}
          positionOffset={{ x: 6, y: 506 }}
          scale={0.8}
          {...layoutElementFontConfiguration}
        />
      )}
      {showActiveFieldsEditorState && (
        <ActiveFieldsEditor
          onChange={(updatedAttribute) => {
            updateReduxElement(updatedAttribute);
            commitLayoutToDB();
          }}
          onCommit={commitLayoutToDB}
          onCommitCancel={cancelLayoutChange}
          entityDataConfiguration={layoutElementEntityDataConfiguration}
          entityTypeId={layoutElementEntityTypeId}
          entityTypeName={layoutElementEntityDataConfiguration ? layoutElementEntityDataConfiguration[0]?.name : ""}
          right="20px"
          top="100px"
        />
      )}
      <div
        onContextMenu={customContextMenu ? show : null}
        style={{ border: "0px solid pink" }}
      >
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
          onDragStop={(nlayout, oldDragItem, l) => { updateLayout(l); }}
          onResizeStop={(nlayout, oldResizeItem, l) => { updateLayout(l); }}
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
      {contextMenu}
      {blockModalState.showing && (
        <BlockModal
          loadID={blockModalState.loadID}
          isShowing
          close={() => {
            setBlockModalState({
              showing: false,
              loadID: null
            });
          }}
          openReport={(e) => { console.log(e); }}
        />
      )}
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
  availableTemplates: PropTypes.arrayOf(PropTypes.object),
  customContextMenu: PropTypes.bool,
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
  availableTemplates: [],
  customContextMenu: false
};
