import React from "react";
import PropTypes from "prop-types";
import Select, { components } from "react-select";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

export default function GroupByControl(props) {
  const {
    options,
    groupByOptions,
    setGroupByOptions,
    setExpandedGroupIds,
  } = props;
  const SortableMultiValue = SortableElement((sortableProps) => {
    const onMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const innerProps = { onMouseDown };
    return <components.MultiValue {...sortableProps} innerProps={innerProps} />;
  });

  const SortableSelect = SortableContainer(Select);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (!Array.isArray(groupByOptions)) return;
    const newOptions = [...groupByOptions];
    newOptions.splice(
      newIndex < 0 ? newOptions.length + newIndex : newIndex,
      0,
      newOptions.splice(oldIndex, 1)[0]
    );
    setGroupByOptions(newOptions);
    setExpandedGroupIds(new Set());
  };

  return (
    <div style={{ width: 400 }}>
      <b>Group by</b>
      (drag to sort)
      <SortableSelect
        axis="xy"
        onSortEnd={onSortEnd}
        distance={4}
        getHelperDimensions={({ node }) => node.getBoundingClientRect()}
        isMulti
        value={groupByOptions}
        onChange={(newOptions) => {
          setGroupByOptions(newOptions);
          setExpandedGroupIds(new Set());
        }}
        options={options}
        components={{
          MultiValue: SortableMultiValue,
        }}
        closeMenuOnSelect={false}
      />
    </div>
  );
}

GroupByControl.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  groupByOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  setGroupByOptions: PropTypes.func.isRequired,
  setExpandedGroupIds: PropTypes.func.isRequired,
};
