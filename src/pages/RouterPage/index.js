import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "../../ui/Navbar";
import "./style.scss";
import Main from "../Main";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar
        tabs={[
          { name: "Main", url: "/main" },
          { name: "Active", url: "/tablica" },
        ]}
      />
      <main>
        <Switch>
          <Route path="/main" exact>
            <Main />
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
