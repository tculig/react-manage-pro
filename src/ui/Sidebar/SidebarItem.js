import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";

export default function SidebarItem(props) {
  const { eventKey, icon, text, submenu } = props;
  return (
    <NavItem eventKey={eventKey}>
      <NavIcon>
        <FontAwesomeIcon icon={icon} size="lg" />
      </NavIcon>
      <NavText>{text}</NavText>
      {submenu}
    </NavItem>
  );
}

SidebarItem.propTypes = {
  eventKey: PropTypes.string.isRequired,
  icon: (PropTypes.shape({ iconName: PropTypes.string.isRequired })).isRequired,
  text: PropTypes.string.isRequired,
  submenu: PropTypes.arrayOf(SidebarItem),
};
SidebarItem.defaultProps = {
  submenu: [],
};
