import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import TerritoryListPage from "./pages/territoryList";
import DrawTerritoryPage from "./pages/map/DrawTerritoryPage";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <h1>Home Page yeah</h1>
        </Route>
        <Route exact path="/territory">
          <TerritoryListPage />
        </Route>
        <Route path="/territory/edit/:id">
          <DrawTerritoryPage />
        </Route>
        <Route path="/territory/work/:territoryId">
          <h1>Work territory</h1>
        </Route>
        <Route path="/territory/lookup/:territoryId">
          <h1>Lookup houses for territory</h1>
        </Route>
        <Route path="/signin">
          <h1>Sign in page</h1>
        </Route>
        <Route>
          <h1>404 not found</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default Routes;
