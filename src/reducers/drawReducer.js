import React from "react";

const initialState = {
  points: [],
  isDrawing: false
};

const ADD_POINT = "add-point";
const UNDO = "undo";
const TOGGLE_IS_DRAWING = "toggle-is-drawing";

function toggleIsDrawing() {
  return { type: TOGGLE_IS_DRAWING };
}

function addPoint(coords) {
  return { type: ADD_POINT, coords };
}

function undo() {
  return { type: UNDO };
}

function drawReducer(state, action) {
  switch (action.type) {
    case ADD_POINT:
      return { ...state, points: [...state.points, action.coords] };
    case UNDO:
      return {
        ...state,
        points: state.points.slice(0, state.points.length - 1)
      };
    case TOGGLE_IS_DRAWING:
      return { ...state, isDrawing: !state.isDrawing };
    default:
      return state;
  }
}

export default function () {
  const [{ isDrawing, points }, dispatch] = React.useReducer(
    drawReducer,
    initialState
  );

  return {
    isDrawing,
    points,
    addPoint: p => dispatch(addPoint(p)),
    undo: () => dispatch(undo()),
    toggleIsDrawing: () => dispatch(toggleIsDrawing())
  };
}
