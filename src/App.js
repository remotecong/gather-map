import React from "react";
import Map from "./maps/map";
import { Marker, Polygon } from "google-maps-react";
import DrawTools from "./drawTools";
import useDrawingState from "./reducers/drawReducer";
import { saveTerritory } from "./utils/database";

import "./App.css";

function App() {
  const {
    isDrawing,
    points,
    addPoint,
    undo,
    toggleIsDrawing,
    reset
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

  async function onSave() {
    if (points.length < 3) {
      return alert(
        "Cannot save territory because it's not a polygon yet. Please add another point on the poly before saving"
      );
    }
    const territoryName = prompt("Territory Name:", "");
    if (!territoryName) {
      return alert("Must provide a name to save territory.");
    }
    if (window.confirm(`Save territory as "${territoryName}"?`)) {
      try {
        await saveTerritory({ name: territoryName, points });
        reset();
      } catch (err) {
        alert("Error!\n" + (err.message || err.toString()));
      }
    }
  }

  return (
    <div className="App">
      <DrawTools
        isDrawing={isDrawing}
        onToggleIsDrawing={toggleIsDrawing}
        onUndo={undo}
        onSave={onSave}
      />
      <Map onClick={onClick}>
        <Polygon
          paths={points}
          onClick={onClick}
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
