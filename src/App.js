import React from "react";
import Map from "./maps/map";
import { Polygon } from "google-maps-react";
import DrawTools from "./drawTools";

import "./App.css";

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

function App() {
  const [{ isDrawing, points }, dispatch] = React.useReducer(
    drawReducer,
    initialState
  );

  const onClick = (_props, _map, e) => {
    if (isDrawing && e && e.latLng) {
      dispatch(addPoint(e.latLng));
    }
  };

  return (
    <div className="App">
      <DrawTools isDrawing={isDrawing} toggleIsDrawing={() => dispatch(toggleIsDrawing())} onUndo={() => dispatch(undo())} />
      <Map onClick={onClick}>
        <Polygon
          paths={points}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#0000FF"
          fillOpacity={0.3}
        />
      </Map>
    </div>
  );
}

export default App;
