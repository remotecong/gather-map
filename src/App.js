import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const [zoom, setZoom] = React.useState(13);
  const [position, setPosition] = React.useState([51.505, -0.09]);

  return (
    <Map center={position} zoom={zoom} style={{height: '100vh'}}>
      <TileLayer
        attribution={'&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS4 popup.<br />Easily customizable.
        </Popup>
      </Marker>
    </Map>
  );
}

export default App;
