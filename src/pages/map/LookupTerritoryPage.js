import React from "react";
import { useRouteMatch } from "react-router-dom";
import Map from "./map";
import { Circle, Polygon } from "google-maps-react";
import useDrawingState from "../../reducers/drawReducer";
import { loadTerritory } from "../../utils/database";
import { getAddress } from "./geocode";

function App() {
  const { addLookup, lookups, points, addPoint } = useDrawingState();
  const [bounds, setBounds] = React.useState(null);
  const {
    params: { territoryId }
  } = useRouteMatch();
  const poly = React.useRef(null);

  React.useEffect(() => {
    async function prepareMap() {
      if (!bounds && "google" in window) {
        const territory = await loadTerritory(territoryId);
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

  async function onPolyClick(_props, _poly, e) {
    try {
      // TODO find more accurate way to weed out non-territory clicks
      if (bounds.contains(e.latLng)) {
        const address = await getAddress(e.latLng);
        addLookup(e.latLng);
        console.log(address);
      }
    } catch (err) {
      console.error("GEOCODE ERR", err);
    }
  }

  function renderLookups() {
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

  return (
    <div className="App">
      <Map bounds={bounds} onClick={onPolyClick}>
        <Polygon
          paths={points}
          strokeColor="#11115F"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#11115F"
          fillOpacity={0.1}
          ref={poly}
        />
        {renderLookups()}
      </Map>
    </div>
  );
}

export default App;
