import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import TerritoryListPage from "./pages/territoryList";
import EditTerritoryPage from "./pages/map/EditTerritoryPage";
import LookupTerritoryPage from "./pages/map/LookupTerritoryPage";
import NewTerritoryPage from "./pages/map/NewTerritoryPage";
import GatherCollectionPage from "./pages/GatherCollectionPage";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <h1>Cedar Ridge Territory</h1>
        </Route>
        <Route exact path="/territory">
          <TerritoryListPage />
        </Route>
        <Route path="/territory/new">
          <NewTerritoryPage />
        </Route>
        <Route path="/territory/edit/:id">
          <EditTerritoryPage />
        </Route>
        <Route path="/territory/work/:territoryId">
          <h1>Work territory</h1>
        </Route>
        <Route path="/territory/lookup/:territoryId">
          <LookupTerritoryPage />
        </Route>
        <Route path="/territory/gather/:territoryId">
          <GatherCollectionPage />
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
