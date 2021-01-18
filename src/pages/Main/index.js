import React, { useState } from "react";
import styled from "styled-components";
import { faHome, faSitemap, faFileAlt, faEye, faObjectGroup } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../../ui/Sidebar";
import SidebarItem from "../../ui/Sidebar/SidebarItem";
import EntityTypes from "./EntityTypes";
import EntityInstances from "./EntityInstances";
import Templates from "./Templates";
import LayoutEdit from "./LayoutEdit";
import HomeView from "./HomeView";

const MainContainer = styled.main`
  position: relative;
  overflow: hidden;
  transition: all 0.15s;
  height: 100%;
  margin-left: ${(props) => (props.expanded ? 240 : 64)}px;
`;

export default function Main() {
  const [state, setState] = useState({
    sidebarExpanded: false,
    sidebarSelected: "homeview",
    sidebarItems: [
      SidebarItem({
        eventKey: "homeview",
        text: "Home",
        icon: faHome,
        key: "homeview"
      }),
      SidebarItem({
        eventKey: "entitytypes",
        text: "Entity Types",
        icon: faSitemap,
        key: "entitytypes"
      }),
      SidebarItem({
        eventKey: "entityinstances",
        text: "Entity Instances",
        icon: faEye,
        key: "entityinstances"
      }),
      SidebarItem({
        eventKey: "templates",
        text: "Block Templates",
        icon: faFileAlt,
        key: "templates"
      }),
      SidebarItem({
        eventKey: "layoutedit",
        text: "Layout edit",
        icon: faObjectGroup,
        key: "layoutedit"
      })
    ],
  });
  function sidebarOnToggle(expanded) {
    setState({
      ...state,
      sidebarExpanded: expanded,
    });
  }
  function sidebarOnSelect(selectedItem) {
    setState({
      ...state,
      sidebarSelected: selectedItem,
    });
  }
  const { sidebarSelected, sidebarItems, sidebarExpanded } = state;
  const sidebarSelectedTitle = sidebarItems.filter((el) => {
    return el.props.eventKey === sidebarSelected;
  })[0]?.props?.text;

  return (
    <div
      style={{
        position: "relative",
        height: "calc(100vh - 56px)",
        overflow: "hidden"
      }}
    >
      <Sidebar
        onToggle={sidebarOnToggle}
        onSelect={sidebarOnSelect}
        selected={sidebarSelected}
        items={sidebarItems}
      />
      <MainContainer expanded={sidebarExpanded}>
        <div style={{
          width: "100%",
          backgroundColor: "linen",
          color: "grey",
          padding: "8px",
          fontWeight: "bold"
        }}
        >
          {sidebarSelectedTitle}
        </div>
        {sidebarSelected === "homeview" && <HomeView />}
        {sidebarSelected === "entitytypes" && <EntityTypes />}
        {sidebarSelected === "entityinstances" && <EntityInstances />}
        {sidebarSelected === "templates" && <Templates />}
        {sidebarSelected === "layoutedit" && <LayoutEdit />}
      </MainContainer>
    </div>
  );
}
