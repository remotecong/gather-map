import React from "react";

const initialState = {
  points: [],
  lookups: [],
  isDrawing: false
};

const TOGGLE_IS_DRAWING = "toggle-is-drawing";
function toggleIsDrawing() {
  return { type: TOGGLE_IS_DRAWING };
}

const ADD_POINT = "add-point";
function addPoint(coords) {
  return { type: ADD_POINT, coords };
}

const UNDO = "undo";
function undo() {
  return { type: UNDO };
}

const RESET = "reset";
function reset() {
  return { type: RESET };
}

const ADD_LOOKUP = "add-lookup";
function addLookup(coords) {
  return { type: ADD_LOOKUP, coords };
}

function drawReducer(state, action) {
  switch (action.type) {
    case ADD_POINT:
      return { ...state, points: [...state.points, action.coords] };
    case ADD_LOOKUP:
      return { ...state, lookups: [...state.lookups, action.coords] };
    case UNDO:
      return {
        ...state,
        points: state.points.slice(0, state.points.length - 1)
      };
    case TOGGLE_IS_DRAWING:
      return { ...state, isDrawing: !state.isDrawing };
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export default function () {
  const [{ isDrawing, points, lookups }, dispatch] = React.useReducer(
    drawReducer,
    initialState
  );

  return {
    isDrawing,
    lookups,
    points,
    addPoint: p => dispatch(addPoint(p)),
    undo: () => dispatch(undo()),
    toggleIsDrawing: () => dispatch(toggleIsDrawing()),
    reset: () => dispatch(reset()),
    addLookup: c => dispatch(addLookup(c))
  };
}
