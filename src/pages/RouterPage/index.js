import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Placeholder from "./Placeholder";
import Navbar from "../../ui/Navbar";
import "./style.scss";
import Main from "../Main";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar
        tabs={[
          { name: "Main", url: "/pogoni" },
          { name: "Active", url: "/tablica" },
        ]}
      />
      <main style={{ marginTop: "56px" }}>
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
          <Route path="/" exact>
            <Main />
          </Route>
        </Switch>
      </main>
      <div id="modal-root" />
    </BrowserRouter>
  );
}
