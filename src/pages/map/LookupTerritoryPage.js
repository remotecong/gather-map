import React from "react";
import { useRouteMatch } from "react-router-dom";
import Map from "./map";
import { Circle, Polygon } from "google-maps-react";
import useDrawingState from "../../reducers/drawReducer";
import useTerritory from "../../reducers/useTerritory";
import { loadTerritory } from "../../utils/database";
import { getAddress } from "./geocode";

let pendingTimerId = -1;

function App() {
  const {
    params: { territoryId }
  } = useRouteMatch();
  const { points, addPoint } = useDrawingState();
  const { addLookup, lookups, loadedTerritory } = useTerritory(territoryId);
  const [bounds, setBounds] = React.useState(null);
  const [pendingLookups, setPendingLookups] = React.useState([]);

  React.useEffect(() => {
    async function prepareMap() {
      if (!bounds && "google" in window) {
        const territory = await loadTerritory(territoryId);
        const bounds = new window.google.maps.LatLngBounds();
        for (const p of territory.points) {
          addPoint(p);
          bounds.extend(p);
        }
        loadedTerritory(territory);
        setBounds(bounds);
      }
    }
    //  TODO find better solution to know when google maps is available
    setTimeout(prepareMap, 1000);
  }, [territoryId, addPoint, bounds, loadedTerritory]);

  async function lookupAddressFromLatLng(latLng, firstTry = true) {
    console.log("LOOKING UP LATLNG", firstTry ? "FROM CLICK" : "FROM PENDING");
    if (firstTry && pendingLookups.length) {
      console.log("DEFERRING LOOKUP", latLng);
      setPendingLookups([...pendingLookups, latLng]);
      return;
    }

    try {
      const address = await getAddress(latLng);
      addLookup(address);
      console.log(address);
      if (!firstTry && pendingLookups.length) {
        lookupAddressFromLatLng(pendingLookups[0]);
        setPendingLookups(pendingLookups.slice(1));
      }
    } catch (err) {
      console.error("GEOCODE ERR", err);
      setPendingLookups([...pendingLookups, latLng]);
      clearTimeout(pendingTimerId);
      pendingTimerId = setTimeout(() => {
        if (pendingLookups.length) {
          const latLng = pendingLookups[0];
          console.log("TRYING LOOKUP AGAIN", latLng);
          lookupAddressFromLatLng(latLng, false);
          setPendingLookups(pendingLookups.slice(1));
        }
      }, 1250);
    }
  }

  async function onPolyClick(_props, _poly, e) {
    // TODO find more accurate way to weed out non-territory clicks
    if (bounds.contains(e.latLng)) {
      lookupAddressFromLatLng(e.latLng);
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
      <Map bounds={bounds} onClick={onPolyClick}>
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
