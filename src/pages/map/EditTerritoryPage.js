import React from "react";
import { useRouteMatch } from "react-router-dom";
import Map from "./map";
import { Marker, Polygon } from "google-maps-react";
import DrawTools from "./drawTools";
import useDrawingState from "../../reducers/drawReducer";
import { loadTerritory, saveTerritory } from "../../utils/database";
import { getAddress } from "./geocode";

function App() {
  const { addLookup, addPoint, isDrawing, points, reset, toggleIsDrawing, undo } = useDrawingState();
  const [bounds, setBounds] = React.useState(null);
  const {
    params: { id: territoryId },
  } = useRouteMatch();

  React.useEffect(() => {
    async function prepareMap() {
      if ("google" in window && !bounds) {
        const { points: territory } = await loadTerritory(territoryId);
        const bounds = new window.google.maps.LatLngBounds();
        for (const p of territory) {
          addPoint(p);
          bounds.extend(p);
        }
        setBounds(bounds);
      }
    }
    //  TODO find better solution to know when google maps is available
    setTimeout(prepareMap, 1000);
  }, [territoryId, addPoint, bounds]);

  function onClick(_props, _map, e) {
    if (isDrawing && e && e.latLng) {
      addPoint(e.latLng);
    }
  }

  async function onPolyClick(_props, _map, e) {
    if (e && e.latLng && bounds) {
      if (isDrawing) {
        addPoint(e.latLng);
      } else if (bounds) {
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

  async function onSave() {
    if (points.length < 3) {
      return alert(
        "Cannot save territory because it's not a polygon yet. Please add another point on the poly before saving"
      );
    }
    if (window.confirm(`Save territory "${territoryId}"?`)) {
      try {
        await saveTerritory({ id: territoryId, points });
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
        onLoadClick={() => console.warn("load clicked")}
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
      </Map>
    </div>
  );
}

export default App;
