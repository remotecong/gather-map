import React from "react";
import { useRouteMatch } from "react-router-dom";
import Map from "./map";
import { Circle, Polygon } from "google-maps-react";
import useDrawingState from "../../reducers/drawReducer";
import useTerritory from "../../reducers/useTerritory";
import { loadTerritory } from "../../utils/database";
import { getLastKnownCoords } from "../../utils/cache";
import { getAddress } from "./geocode";

let pendingLookups = [];
let delayMultiplier = 1;

function App() {
  const {
    params: { territoryId },
  } = useRouteMatch();
  const { points, addPoint } = useDrawingState();
  const { addLookup, lookups, loadedTerritory } = useTerritory(territoryId);
  const [bounds, setBounds] = React.useState(null);
  const [pendingTimerId, setPendingTimerId] = React.useState(-1);

  React.useEffect(() => {
    async function prepareMap() {
      console.log("Preparing", Date.now());
      if ("google" in window) {
        const territory = await loadTerritory(territoryId);
        const bounds = new window.google.maps.LatLngBounds();
        for (const p of territory.points) {
          addPoint(p);
          bounds.extend(p);
        }
        loadedTerritory(territory);
        const lastKnownCenter = getLastKnownCoords();
        if (!lastKnownCenter || !bounds.contains(lastKnownCenter)) {
          setBounds(bounds);
        }
      }
    }
    //  TODO find better solution to know when google maps is available
    setTimeout(prepareMap, 1000);
  }, [territoryId]);

  function timeLookup(latLng) {
    clearTimeout(pendingTimerId);
    if (latLng) {
      pendingLookups.push(latLng);
    }
    setPendingTimerId(setTimeout(async () => await lookupAddressFromLatLng(), delayMultiplier * 1250));
  }

  async function lookupAddressFromLatLng() {
    const latLng = pendingLookups[0];
    if (!latLng) {
      return;
    }

    try {
      const address = await getAddress(latLng);
      addLookup(address);
      pendingLookups.shift();
      delayMultiplier = Math.max(0, delayMultiplier - 1);
    } catch (err) {
      delayMultiplier++;
    }
    if (pendingLookups.length) {
      timeLookup();
    } else {
      delayMultiplier = 0;
    }
  }

  function onPolyClick(_props, _poly, e) {
    // TODO find more accurate way to weed out non-territory clicks
    if (!bounds || bounds.contains(e.latLng)) {
      timeLookup(e.latLng);
    }
  }

  function renderCircles(color, latLngs) {
    return latLngs.map((position, i) => (
      <Circle
        key={`${i}-${color}`}
        radius={8}
        center={position}
        strokeColor="transparent"
        strokeOpacity={0}
        strokeWeight={0}
        fillColor={color}
        fillOpacity={0.2}
      />
    ));
  }

  function renderLookups() {
    return renderCircles("#00FF00", lookups);
  }

  function renderPendingLookups() {
    return renderCircles("#BEEEEF", pendingLookups);
  }

  return (
    <div className="App">
      <Map bounds={bounds}>
        <Polygon
          paths={points}
          onClick={onPolyClick}
          strokeColor="#11115F"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#11115F"
          fillOpacity={0.1}
        />
        {renderLookups()}
        {renderPendingLookups()}
      </Map>
    </div>
  );
}

export default App;
