import SideNav from "@trendmicro/react-sidenav";
import PropTypes from "prop-types";
import React from "react";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import "./style.scss";

export default function Sidebar(props) {
  const { onToggle, onSelect, selected, items } = props;
  return (
    <SideNav
      onToggle={onToggle}
      onSelect={onSelect}
      style={{ background: "#9494b8" }}
    >
      <SideNav.Toggle />
      <SideNav.Nav selected={selected}>{items}</SideNav.Nav>
    </SideNav>
  );
}

Sidebar.propTypes = {
  onToggle: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidebar.defaultProps = {
  onToggle: () => {},
  onSelect: () => {},
};
