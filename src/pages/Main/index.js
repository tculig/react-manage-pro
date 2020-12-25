import React, { useState } from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../../ui/Sidebar";
import SidebarItem from "../../ui/Sidebar/SidebarItem";

export default function Main() {
  const [state, setState] = useState({
    sidebarSelected: "gridview",
    sidebarItems: [
      <SidebarItem
        eventKey="gridview"
        text="GridView"
        icon={faHome}
        key="gridview"
      />,
    ],
  });
  function sidebarOnToggle() {
    console.log("toggle");
  }
  function sidebarOnSelect(selectedItem) {
    console.log(selectedItem);
    setState({
      ...state,
      sidebarSelected: selectedItem,
    });
  }
  const { sidebarSelected, sidebarItems } = state;
  return (
    <div
      style={{
        position: "absolute",
        top: "56px",
        height: "calc(100vh - 56px)",
      }}
    >
      <Sidebar
        onToggle={sidebarOnToggle}
        onSelect={sidebarOnSelect}
        selected={sidebarSelected}
        items={sidebarItems}
      />
    </div>
  );
}
