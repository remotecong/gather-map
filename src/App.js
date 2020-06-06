import React from "react";
import Map from "./maps/map";
import { Marker, Polygon } from "google-maps-react";
import DrawTools from "./drawTools";
import useDrawingState from "./reducers/drawReducer";

import "./App.css";

function App() {
  const {
    isDrawing,
    points,
    addPoint,
    undo,
    toggleIsDrawing
  } = useDrawingState();

  const onClick = (_props, _map, e) => {
    if (isDrawing && e && e.latLng) {
      addPoint(e.latLng);
    }
  };

  const renderLastPoint = () => {
    const i = points.length - 1;
    if (0 <= i) {
      return <Marker position={points[i]} />;
    }
  };

  return (
    <div className="App">
      <DrawTools
        isDrawing={isDrawing}
        toggleIsDrawing={toggleIsDrawing}
        onUndo={undo}
      />
      <Map onClick={onClick}>
        <Polygon
          paths={points}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#0000FF"
          fillOpacity={0.3}
        />
        {renderLastPoint()}
      </Map>
    </div>
  );
}

export default App;
