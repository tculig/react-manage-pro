import React, { useEffect, useRef, useState } from "react";
import { first as _first } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { selectLayout, storeLayout } from "../../../redux/templatesSlice";
import { getTemplateWithPropertiesByID, getAvailableTemplates, removeTemplateDB, createTemplateDB, updateTemplateDB } from "./dbcalls";
import Gridlet from "../../../components/Gridlet";
import ControlWidget from "../../../ui/ControlWidget";
import DuplicateValidator from "../../../validators/DuplicateValidator";
import EmptyFieldsValidator from "../../../validators/EmptyFieldsValidator";
import TemplateModal from "../../../modals/TemplateModal";
import ConfirmationModal from "../../../modals/ConfirmationModal";
import { propertyTypes } from "../../../utils/Constants";

export default function LayoutItemTemplates() {
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

  function updateShowing(newValue) {
    setSelectState({
      ...selectState,
      value: newValue,
    });
  }

  // DB FUNCTIONS
  async function loadAvailableTemplatesDB() {
    const availableTemplates = await getAvailableTemplates();
    const selectRows = availableTemplates.map((entry) => {
      return { value: entry.id, label: entry.name };
    });
    setSelectState({
      ...selectState,
      options: selectRows,
      value: selectRows[0],
    });
  }

  async function loadTemplateDB(id) {
    const showingTemplate = await getTemplateWithPropertiesByID(id);
    dispatch(storeLayout(showingTemplate));
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
    const [createResponse] = await createTemplateDB(name);
    await loadAvailableTemplatesDB();
    selectTemplateID(createResponse.insertId);
  }

  async function updateTemplate(modalInternalState) {
    const updateResponse = await updateTemplateDB(modalInternalState);
    console.log(updateResponse);
    await loadAvailableTemplatesDB();
    selectTemplateID(modalInternalState.id);
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
      loadID: null,
      confirm: updateTemplate,
    });
  }

  function toggleDeleteModal() {
    setIsShowingDeleteConfirmModal(true);
  }

  async function deleteEntityType(id) {
    await removeTemplateDB(id);
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
  }, []);

  useEffect(() => {
    if (selectState.value) {
      loadTemplateDB(selectState.value.value);
    }
  }, [selectState.value]);

  // VARIABLES
  const rootRef = useRef();
  const layout = useSelector(selectLayout);
  const [width, height] = [
    rootRef.current?.offsetWidth,
    rootRef.current?.offsetHeight,
  ];
  const cols = width / 10;
  const rows = height / 10;
  const isShowingTemplateModal = modalState.isShowing;
  const selectedTemplateID = selectState.value?.value;
  const selectOptionValues = selectState.options.map(el => el.label);

  return (
    <div
      ref={rootRef}
      style={{
        height: "calc(100vh - 56px)",
        border: "1px solid red",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ControlWidget
        onAdd={toggleNewTemplateModal}
        onEdit={toggleEditModal}
        onDelete={toggleDeleteModal}
        select={selectState}
      />
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
      {isShowingTemplateModal && (
        <TemplateModal
          {...modalState}
          close={closeModal}
          cancel={closeModal}
          validators={[
            new EmptyFieldsValidator(),
            new DuplicateValidator(selectOptionValues)
          ]}
        />
      )}
      {isShowingDeleteConfirmModal && (
        <ConfirmationModal
          header="Confirmation"
          message={`Are you sure you want to delete template: ${2}`}
          confirm={() => deleteEntityType(selectedTemplateID)}
          close={() => setIsShowingDeleteConfirmModal(false)}
        />
      )}
    </div>
  );
}
