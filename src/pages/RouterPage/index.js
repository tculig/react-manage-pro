import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Placeholder from "./Placeholder";

export default function AppRouter() {
  return (
    <Router>
      <div style={{ position: "relative" }}>
        { /* This is required so that the sidebar can position itself.An element with position: absolute; is positioned relative to the nearest
            positioned ancestor  (instead of positioned relative to the viewport, like fixed). However; if an absolute positioned element has no
            positioned ancestors, it uses the document body, and moves along with page scrolling. */ }
        <main style={{ position: "absolute" }}>
          <div
            style={{
              position: "relative",
              height: "calc(100vh)",
              width: "calc(100vw)",
              overflow: "hidden",
            }}
          >
            <Switch>
              <Route path="/dijelovi" exact>
                <Placeholder title="dijelovi" />
              </Route>
              <Route path="/procedure" exact>
                <Placeholder title="procedure" />
              </Route>
              <Route path="/admin" exact>
                <Placeholder title="admin" />
              </Route>
              <Route path="/odlogiraj" exact>
                <Placeholder title="odlogiraj" />
              </Route>
            </Switch>
          </div>
        </main>
      </div>
    </Router>
  );
}
