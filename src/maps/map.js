import React from "react";
import { GoogleApiWrapper, Map } from "google-maps-react";
import {
  getLastKnownCoords,
  getLastKnownZoom,
  setLastKnownCoords,
  setLastKnownZoom
} from "../utils/cache";

function saveCurrentPosition(ignore, map) {
  const center = map.getCenter();
  console.log(ignore);
  console.log("map", map);
  if (null != center) {
    setLastKnownCoords(center);
    setLastKnownZoom(map.getZoom());
  }
}

export const MapContainer = ({ google, onClick, children, ...otherProps }) => {
  return (
    <Map
      google={google}
      zoom={getLastKnownZoom()}
      onClick={onClick}
      onIdle={saveCurrentPosition}
      initialCenter={getLastKnownCoords()}
    >
      {children}
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(MapContainer);
