import React, { useState } from "react";
import styled from "styled-components";
import { faHome, faSitemap, faFileAlt, faEye, faObjectGroup } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../../ui/Sidebar";
import SidebarItem from "../../ui/Sidebar/SidebarItem";
import EntityTypes from "./EntityTypes";
import EntityInstances from "./EntityInstances";
import LayoutItemTemplates from "./LayoutItemTemplates";

const MainContainer = styled.main`
  position: relative;
  overflow: hidden;
  transition: all 0.15s;
  margin-left: ${(props) => (props.expanded ? 240 : 64)}px;
`;

export default function Main() {
  const [state, setState] = useState({
    sidebarExpanded: false,
    sidebarSelected: "layoutitemtemplates",
    sidebarItems: [
      <SidebarItem
        eventKey="gridview"
        text="GridView"
        icon={faHome}
        key="gridview"
      />,
      <SidebarItem
        eventKey="entitytypes"
        text="Entity Types"
        icon={faSitemap}
        key="entitytypes"
      />,
      <SidebarItem
        eventKey="entityinstances"
        text="Entity Instances"
        icon={faEye}
        key="entityinstances"
      />,
      <SidebarItem
        eventKey="layoutitemtemplates"
        text="Layout Item Templates"
        icon={faFileAlt}
        key="layoutitemtemplates"
      />,
      <SidebarItem
        eventKey="screen"
        text="Screen"
        icon={faObjectGroup}
        key="screen"
      />,
    ],
  });
  function sidebarOnToggle(expanded) {
    setState({
      ...state,
      sidebarExpanded: expanded,
    });
  }
  function sidebarOnSelect(selectedItem) {
    console.log(selectedItem);
    setState({
      ...state,
      sidebarSelected: selectedItem,
    });
  }
  const { sidebarSelected, sidebarItems, sidebarExpanded } = state;
  return (
    <div
      style={{
        position: "relative",
        height: "calc(100vh - 56px)",
      }}
    >
      <Sidebar
        onToggle={sidebarOnToggle}
        onSelect={sidebarOnSelect}
        selected={sidebarSelected}
        items={sidebarItems}
      />
      <MainContainer expanded={sidebarExpanded}>
        {sidebarSelected === "entitytypes" && <EntityTypes />}
        {sidebarSelected === "entityinstances" && <EntityInstances />}
        {sidebarSelected === "layoutitemtemplates" && <LayoutItemTemplates />}
      </MainContainer>
    </div>
  );
}
