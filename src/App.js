import React from "react";
import { getLastKnownCoords, getLastKnownZoom } from "./utils/cache";
import Map from "./maps/map";

import "./App.css";

function App() {
  const [markers, setMarkers] = React.useState([]);

  const onClick = e => {
    if (e && e.lat && e.lng) {
      setMarkers([...markers, { lat: e.lat, lng: e.lng }]);
    }
  };

  const renderMarkers = () => {
    if (true) {
      return null;
    }
    return markers.map(m => (
      <div
        style={{ background: "magenta", width: 10, height: 10 }}
        lat={m.position.lat}
      />
    ));
  };

  return (
    <div className="App">
      <Map
        defaultZoom={getLastKnownZoom()}
        defaultCenter={getLastKnownCoords()}
        onClick={onClick}
      >
        {renderMarkers()}
      </Map>
    </div>
  );
}

export default App;
