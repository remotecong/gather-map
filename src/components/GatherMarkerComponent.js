import React from 'react';
import * as L from 'leaflet';
import { Marker } from 'react-leaflet';

const Icon = new L.Icon({
  iconUrl: 'marker.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function({
  position,
}) {
  console.log(position);
  return (
    <Marker position={position} icon={Icon} />
  );
}
