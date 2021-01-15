import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Gridlet from "../../../components/Gridlet";
import ConfirmationModal from "../../../modals/ConfirmationModal";
import TemplateModal from "../../../modals/TemplateModal";
import { selectLayoutRedux, storeLayoutRedux } from "../../../redux/layoutSlice";
import { nullToUndefinedArray } from "../../../utils";
import DuplicateValidator from "../../../validators/DuplicateValidator";
import EmptyFieldsValidator from "../../../validators/EmptyFieldsValidator";
import { fillEntityDataConfiguration, getAvailableEntityTypes, getAvailableLayouts, getLayoutWithPropertiesByID, removeLayoutDB } from "./dbcalls";

export default function MainLayout() {
  const dispatch = useDispatch();
  // STATE DECLARATIONS
  const [selectState, setSelectState] = useState({
    options: [],
    onChange: updateShowing, // eslint-disable-line
    value: null,
  });
  const [modalState, setModalState] = useState({
    isShowing: false,
    loadID: null,
    confirm: () => {},
  });
  const [isShowingDeleteConfirmModal, setIsShowingDeleteConfirmModal] = useState(false);
  const [availableEntityTypes, setAvailableEntityTypes] = useState([]);

  function updateShowing(newValue) {
    setSelectState((oldState) => {
      return {
        ...oldState,
        value: newValue,
      };
    });
  }

  // DB FUNCTIONS
  async function loadAvailableLayoutsDB() {
    const availableLayouts = await getAvailableLayouts("layout");
    const selectRows = availableLayouts.map((entry) => {
      return { value: entry.id, label: entry.name };
    });
    setSelectState((oldState) => {
      return {
        ...oldState,
        options: selectRows,
        value: selectRows[0],
      };
    });
  }
  async function loadAvailableEntityTypes() {
    const availableEntities = await getAvailableEntityTypes();
    setAvailableEntityTypes(availableEntities);
  }

  async function loadLayoutDB(id) {
    let showingLayout = await getLayoutWithPropertiesByID("layout", id);
    showingLayout = nullToUndefinedArray(showingLayout);
    if (showingLayout.length > 0) {
      showingLayout = await fillEntityDataConfiguration(showingLayout);
    }
    dispatch(storeLayoutRedux(showingLayout));
  }
  // UI FUNCTIONS

  // CRUD FUNCTIONS

  // MODAL FUNCTIONS

  async function deleteEntityType(id) {
    await removeLayoutDB("layout", id);
    loadAvailableLayoutsDB();
  }

  function closeModal() {
    setModalState({
      isShowing: false,
      loadID: null,
      confirm: () => {}
    });
  }

  // USE EFFECT FUNCTIONS
  useEffect(() => {
    loadAvailableLayoutsDB();
    loadAvailableEntityTypes();
  }, []);

  useEffect(() => {
    if (selectState.value) {
      loadLayoutDB(selectState.value.value);
    }
  }, [selectState.value]);// eslint-disable-line

  // VARIABLES
  const rootRef = useRef();
  const layout = useSelector(selectLayoutRedux);
  const [width, height] = [
    rootRef.current?.offsetWidth,
    rootRef.current?.offsetHeight,
  ];
  const cols = width / 10;
  const rows = height / 10;
  const isShowingLayoutModal = modalState.isShowing;
  const selectedLayoutID = selectState.value?.value;
  const selectedLayoutLabel = selectState.value?.label;
  const selectOptionValues = selectState.options.map(el => el.label);

  return (
    <div
      ref={rootRef}
      style={{
        height: "calc(100vh - 56px)",
        border: "0px solid red",
        position: "relative",
        overflow: "hidden",
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
      />
      {isShowingLayoutModal && (
        <TemplateModal
          {...modalState}
          close={closeModal}
          cancel={closeModal}
          availableEntityTypes={availableEntityTypes}
          validators={[
            new EmptyFieldsValidator(),
            new DuplicateValidator(selectOptionValues)
          ]}
        />
      )}
      {isShowingDeleteConfirmModal && (
        <ConfirmationModal
          header="Confirmation"
          message={`Are you sure you want to delete template: ${selectedLayoutLabel}`}
          confirm={() => deleteEntityType(selectedLayoutID)}
          close={() => setIsShowingDeleteConfirmModal(false)}
        />
      )}
    </div>
  );
}
