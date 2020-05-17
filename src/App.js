import React from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker
} from "react-google-maps";
import { getLastKnownCoords, getLastKnownZoom } from "./utils/cache";
import "./App.css";

const GatherMapComponent = withScriptjs(
  withGoogleMap(props => {
    return (
      <GoogleMap
        defaultZoom={getLastKnownZoom()}
        defaultCenter={getLastKnownCoords()}
        onClick={props.onMapClick}
      >
        {props.markers.map(m => (
          <Marker position={m.position} />
        ))}
      </GoogleMap>
    );
  })
);

function App() {
  const [markers, setMarkers] = React.useState([]);

  const onClick = e => {
    if (e && e.latLng) {
      setMarkers([...markers, { position: e.latLng }]);
    }
  };

  return (
    <div className="App">
      <GatherMapComponent
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
        onMapClick={onClick}
        markers={markers}
      />
    </div>
  );
}

export default App;
