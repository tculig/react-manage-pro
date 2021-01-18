import React, { useEffect, useRef, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Gridlet from "../../../components/Gridlet";
import { selectLayoutRedux, storeLayoutRedux, storeLayoutId } from "../../../redux/layoutSlice";
import { fillTemplateData, getAvailableLayouts, getLayoutPropertiesByID, fillEntityDataConfiguration } from "./dbcalls";
import { nullToUndefinedArray } from "../../../utils";

export const MainContext = React.createContext({});

export default function HomeView() {
  const dispatch = useDispatch();
  // STATE DECLARATIONS
  const [availableTemplates, setAvailableTemplates] = useState([]);

  // DB FUNCTIONS
  async function loadDefaultLayout() {
    const availableLayouts = await getAvailableLayouts("layout");
    if (availableLayouts.length === 0) return;
    let defaultLayout = await getLayoutPropertiesByID("layout", availableLayouts[0].id);
    if (defaultLayout.length !== 0) {
      defaultLayout = nullToUndefinedArray(defaultLayout);
      defaultLayout = await fillTemplateData(defaultLayout);
      defaultLayout = await fillEntityDataConfiguration(defaultLayout);
      dispatch(storeLayoutRedux(defaultLayout));
    }
    dispatch(storeLayoutId(availableLayouts[0].id));
  }

  async function loadAvailableTemplates() {
    const availableTemplatesDB = await getAvailableLayouts("template");
    setAvailableTemplates(availableTemplatesDB);
  }

  // CONTEXT FUNCTIONS
  const contextData = useContext(MainContext);
  contextData.reloadLayout = () => {
    loadDefaultLayout();
  };

  // UI FUNCTIONS

  // CRUD FUNCTIONS

  // MODAL FUNCTIONS

  // USE EFFECT FUNCTIONS
  useEffect(() => {
    loadDefaultLayout();
    loadAvailableTemplates();
  }, []);// eslint-disable-line

  // VARIABLES
  const rootRef = useRef();
  const layout = useSelector(selectLayoutRedux);
  /* const [width, height] = [
    rootRef.current?.offsetWidth,
    rootRef.current?.offsetHeight,
  ]; */
  const cols = 200;
  const rows = 100;
  const width = cols * 10;
  const height = rows * 10;

  return (
    <div
      ref={rootRef}
      style={{
        border: "0px solid red",
        position: "relative",
        overflow: "auto",
        height: "100%"
      }}
    >
      <Gridlet
        name="root"
        level={0}
        scale={1}
        cols={cols}
        rows={rows}
        width={width}
        height={height}
        layout={layout}
        availableTemplates={availableTemplates}
      />
    </div>
  );
}
