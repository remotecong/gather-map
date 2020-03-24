import React from 'react';
import { Map, LayersControl, Marker, Popup } from 'react-leaflet';
import { GoogleMutant, GoogleApiLoader } from 'react-leaflet-googlemutant';
import 'leaflet/dist/leaflet.css';

function App() {
  const [zoom, setZoom] = React.useState(13);
  const [position, setPosition] = React.useState([51.505, -0.09]);
  const { BaseLayer } = LayersControl;

  return (
    <>
      <GoogleApiLoader apiKey="AIzaSyCaMRWqlcMu96wUqotTCAwxNXPIH8Rif6c">
        <Map center={position} zoom={zoom} style={{height: '100vh'}}>
          <LayersControl position='topright'>
            <BaseLayer checked name='Google Maps Roads'>
              <GoogleMutant type="roadmap"/>
            </BaseLayer>
            <BaseLayer name='Google Maps Satellite'>
              <GoogleMutant type="satellite" />
            </BaseLayer>
          </LayersControl>
          <Marker position={position}>
            <Popup>
              A pretty CSS4 popup.<br />Easily customizable.
            </Popup>
          </Marker>
        </Map>
      </GoogleApiLoader>
    </>
  );
}

export default App;
