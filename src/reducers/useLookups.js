import React from "react";
import {
  getLookupsForTerritory,
  saveLookupsForTerritory
} from "../utils/database";

const initialState = {
  lookups: [],
  loadedCachedLookups: false
};

const ADD_LOOKUP = "add-lookup";
function addLookup(coords) {
  return { type: ADD_LOOKUP, coords };
}

const LOADED_LOOKUPS = "loaded-lookups";
function loadedLookups(data) {
  return { type: LOADED_LOOKUPS, data };
}

function lookupsReducer(state, action) {
  switch (action.type) {
    case ADD_LOOKUP:
      return { ...state, lookups: [...state.lookups, action.coords] };
    case LOADED_LOOKUPS:
      return {
        ...state,
        lookups: action.data || [],
        loadedCachedLookups: true
      };
    default:
      return state;
  }
}

const timers = {};

export default function (territoryId) {
  const [{ lookups, loadedCachedLookups }, dispatch] = React.useReducer(
    lookupsReducer,
    initialState
  );

  function dispatchAddLookup(coordinates) {
    if (territoryId in timers) {
      clearTimeout(timers[territoryId]);
    }
    timers[territoryId] = setTimeout(
      () => saveLookupsForTerritory(territoryId, lookups),
      30 * 1000
    );
    dispatch(addLookup(coordinates));
  }

  //  TODO clean this up
  if (!loadedCachedLookups) {
    getLookupsForTerritory(territoryId)
      .then(lookups => dispatch(loadedLookups(lookups)))
      .catch(err => {
        console.error("Lookups Cache GET Failed", err);
        dispatch(loadedLookups(null));
      });
  }

  return {
    lookups,
    addLookup: c => dispatchAddLookup(c)
  };
}
