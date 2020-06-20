import React from "react";
import { saveTerritory } from "../utils/database";

const initialState = {
  id: null,
  points: [],
  residences: []
};

const ADD_LOOKUP = "add-lookup";
function addLookup(data) {
  return { type: ADD_LOOKUP, data };
}

const ADD_POINT = "add-point";
function addPoint(coords) {
  return { type: ADD_POINT, coords };
}

const LOADED_TERRITORY = "loaded-territory";
function loadedTerritory(data) {
  return { type: LOADED_TERRITORY, data };
}

function addResidence(residences, addition) {
  if (
    !residences.some(
      ({ gatherAddress }) => gatherAddress === addition.gatherAddress
    )
  ) {
    return residences.concat([addition]);
  }
  return residences;
}

function lookupsReducer(state, action) {
  switch (action.type) {
    case ADD_LOOKUP:
      return {
        ...state,
        residences: addResidence(state.residences, action.data)
      };
    case ADD_POINT:
      return { ...state, points: [...state.points, action.coords] };
    case LOADED_TERRITORY:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}

const timers = {};

export default function (territoryId) {
  const [{ id, points, residences }, dispatch] = React.useReducer(
    lookupsReducer,
    initialState
  );

  function deferSave() {
    const idToUse = territoryId || id;
    if (idToUse in timers) {
      clearTimeout(timers[idToUse]);
    }
    timers[idToUse] = setTimeout(
      () => saveTerritory({ id, points, residences }),
      10 * 1000
    );
  }

  function dispatchAddLookup(lookup) {
    dispatch(addLookup(lookup));
    deferSave();
  }

  function dispatchAddPoint(point) {
    dispatch(addPoint(point));
    deferSave();
  }

  return {
    id,
    lookups: residences.map(({ latLng }) => latLng),
    points,
    addLookup: c => dispatchAddLookup(c),
    addPoint: p => dispatchAddPoint(p),
    //  no caching to happen here since it's fresh from the cache
    loadedTerritory: t => dispatch(loadedTerritory(t))
  };
}
