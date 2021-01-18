import React from "react";
import HomeView from "../HomeView";
import EntityInstances from "../EntityInstances";

export default function LayoutEdit() {
  return (
    <div id="containerH" style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          height: "calc(50vh - 28px)",
          position: "relative",
          borderBottom: "4px solid black",
          overflow: "hidden",
        }}
      >
        <HomeView />
      </div>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <EntityInstances showControls={false} />
      </div>
    </div>
  );
}
