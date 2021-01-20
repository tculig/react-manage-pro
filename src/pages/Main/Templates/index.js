import React, { useEffect, useRef, useState } from "react";
import { first as _first } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import FontPicker from "font-picker-react";
import { selectLayoutRedux, storeLayoutRedux, resetRedux, storeLayoutData } from "../../../redux/layoutSlice";
import { getLayoutWithPropertiesByID, getAvailableLayouts, removeLayoutDB,
  createLayoutDB, updateLayoutDB } from "../HomeView/dbcalls";
import { getAvailableEntityTypes, fillEntityDataConfigurationForTemplates } from "./dbcalls";
import Gridlet from "../../../components/Gridlet";
import ControlWidget from "../../../ui/ControlWidget";
import DuplicateValidator from "../../../validators/DuplicateValidator";
import EmptyFieldsValidator from "../../../validators/EmptyFieldsValidator";
import TemplateModal from "../../../modals/TemplateModal";
import ConfirmationModal from "../../../modals/ConfirmationModal";
import { propertyTypes } from "../../../utils/Constants";
import { nullToUndefinedArray } from "../../../utils";

export default function Templates() {
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
  async function loadAvailableTemplatesDB() {
    const availableTemplates = await getAvailableLayouts("template");
    const selectRows = availableTemplates.map((entry) => {
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

  async function loadTemplateDB(id) {
    let showingTemplate = await getLayoutWithPropertiesByID("template", id);
    showingTemplate = nullToUndefinedArray(showingTemplate);
    showingTemplate = await fillEntityDataConfigurationForTemplates(showingTemplate);
    dispatch(storeLayoutRedux(showingTemplate));
    dispatch(storeLayoutData({
      id: showingTemplate[0].id,
      table: "template_properties"
    }));
  }
  // UI FUNCTIONS
  function selectTemplateID(id) {
    setSelectState((oldState) => {
      const newSelectValue = _first(
        oldState.options.filter((option) => option.value === id)
      );
      return {
        ...oldState,
        value: newSelectValue,
      };
    });
  }

  // CRUD FUNCTIONS
  async function createTemplate(modalInternalState) {
    const name = modalInternalState.fields[0].property_value;
    const [createResponse] = await createLayoutDB("template", name, modalInternalState.selectValue.value);
    await loadAvailableTemplatesDB();
    selectTemplateID(createResponse.insertId);
  }

  async function updateTemplate(modalInternalState) {
    await updateLayoutDB("template", modalInternalState);
    await loadAvailableTemplatesDB();
    selectTemplateID(modalInternalState.loadID);
  }

  // MODAL FUNCTIONS
  function toggleNewTemplateModal() {
    setModalState({
      isShowing: true,
      loadID: null,
      confirm: createTemplate,
      fields: [{
        property_name: "Name:",
        property_type: propertyTypes.TEXT,
        property_value: ""
      }]
    });
  }
  function toggleEditModal() {
    setModalState({
      isShowing: true,
      loadID: selectState.value.value,
      confirm: updateTemplate,
      fields: [{
        property_name: "Name:",
        property_type: propertyTypes.TEXT,
        property_value: selectState.value.label
      }]
    });
  }

  function toggleDeleteModal() {
    setIsShowingDeleteConfirmModal(true);
  }

  async function deleteEntityType(id) {
    await removeLayoutDB("template", id);
    loadAvailableTemplatesDB();
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
    loadAvailableTemplatesDB();
    loadAvailableEntityTypes();
    return () => {
      dispatch(resetRedux());
    };
  }, []);// eslint-disable-line

  useEffect(() => {
    if (selectState.value) {
      loadTemplateDB(selectState.value.value);
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
  const isShowingTemplateModal = modalState.isShowing;
  const selectedTemplateID = selectState.value?.value;
  const selectedTemplateLabel = selectState.value?.label;
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
      <ControlWidget
        onAdd={toggleNewTemplateModal}
        onEdit={toggleEditModal}
        onDelete={toggleDeleteModal}
        select={selectState}
        right={20}
      />
      <Gridlet
        showColorEditor
        showFontEditor
        showActiveFieldsEditor
        name="root"
        level={0}
        scale={1}
        cols={cols}
        rows={rows}
        width={width}
        height={height}
        layout={layout}
      />
      {isShowingTemplateModal && (
        <TemplateModal
          {...modalState}
          close={closeModal}
          cancel={closeModal}
          availableEntityTypes={availableEntityTypes}
          validators={[
            new EmptyFieldsValidator(),
            new DuplicateValidator(selectOptionValues),
          ]}
        />
      )}
      {isShowingDeleteConfirmModal && (
        <ConfirmationModal
          header="Confirmation"
          message={`Are you sure you want to delete template: ${selectedTemplateLabel}`}
          confirm={() => deleteEntityType(selectedTemplateID)}
          close={() => setIsShowingDeleteConfirmModal(false)}
        />
      )}
      <div style={{ display: "none" }}>
        {/* This is needed to load the fonts via the api */}
        <FontPicker apiKey="AIzaSyCH4ssHDe9Cd6iqYtvlzX9s75Qd6JCijM4" />
      </div>
    </div>
  );
}
