import React from "react";
import Map from "./map";
import { Circle, Marker, Polygon } from "google-maps-react";
import DrawTools from "./drawTools";
import useDrawingState from "../../reducers/drawReducer";
import {
  getTerritoryList,
  loadTerritory,
  saveTerritory
} from "../../utils/database";
import { getAddress } from "./geocode";

function App() {
  const {
    addLookup,
    addPoint,
    isDrawing,
    lookups,
    points,
    reset,
    toggleIsDrawing,
    undo
  } = useDrawingState();
  const [bounds, setBounds] = React.useState(null);

  function onClick(_props, _map, e) {
    if (isDrawing && e && e.latLng) {
      addPoint(e.latLng);
    }
  }

  async function onPolyClick(_props, _map, e) {
    if (e && e.latLng && bounds) {
      if (isDrawing) {
        addPoint(e.latLng);
      } else {
        try {
          const address = await getAddress(e.latLng);
          addLookup(e.latLng);
          console.log("Address:", address);
        } catch (err) {
          console.error("GEOCODE ERR", err);
        }
      }
    }
  }

  const renderLastPoint = () => {
    const i = points.length - 1;
    if (isDrawing && 0 <= i) {
      return <Marker position={points[i]} />;
    }
  };

  function renderLookups() {
    if (!isDrawing) {
      return lookups.map((position, i) => (
        <Circle
          key={i}
          radius={8}
          center={position}
          strokeColor="transparent"
          strokeOpacity={0}
          strokeWeight={0}
          fillColor="#00FF00"
          fillOpacity={0.2}
        />
      ));
    }
  }

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

  async function onLoadClick() {
    const name = prompt("Please enter territory name:", "");
    if (!(await getTerritoryList()).includes(name)) {
      return alert(`Cannot find territory with a name of "${name}"`);
    }
    reset();
    const territory = await loadTerritory(name);
    const bounds = new window.google.maps.LatLngBounds();
    for (const p of territory.points) {
      addPoint(p);
      bounds.extend(p);
    }
    setBounds(bounds);
  }

  return (
    <div className="App">
      <DrawTools
        isDrawing={isDrawing}
        onToggleIsDrawing={toggleIsDrawing}
        onUndo={undo}
        onSave={onSave}
        onLoadClick={onLoadClick}
      />
      <Map bounds={bounds} onClick={onClick}>
        <Polygon
          paths={points}
          onClick={onPolyClick}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#0000FF"
          fillOpacity={0.1}
        />
        {renderLastPoint()}
        {renderLookups()}
      </Map>
    </div>
  );
}

export default App;
