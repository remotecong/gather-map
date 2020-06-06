import React from "react";
import { GoogleApiWrapper, Map } from "google-maps-react";

export const MapContainer = props => {
  return (
    <Map
      google={props.google}
      zoom={props.defaultZoom}
      initialCenter={props.defaultCenter}
    ></Map>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(MapContainer);
