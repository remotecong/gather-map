import React from 'react';
import { Map, LayersControl, Popup } from 'react-leaflet';
import { GoogleMutant, GoogleApiLoader } from 'react-leaflet-googlemutant';
import 'leaflet/dist/leaflet.css';
import Marker from './components/GatherMarkerComponent';

const { BaseLayer } = LayersControl;

class App extends React.Component {
  state = {
    zoom: 13,
    position: [36.002861, -95.886398],
    markers: [],
  };

  onClickLocation = (e) => {
    const markerData = {
      id: e.latlng.lat.toString() + e.latlng.lng.toString(),
      position: e.latlng,
    };
    const markers = this.state.markers
      .concat([markerData])
      .filter((data, i, collection) => collection.findIndex(({ id }) => data.id === id) === i);
    if (markers.length !== this.state.markers.length) {
      this.setState({ markers: this.state.markers.concat([markerData]) });
    }
  };

  renderMarkers = () => {
    return this.state.markers.map(({ id, position }) => {
      return <Marker key={id} position={position} />;
    });
  };

  render = () => {
    const { position, zoom } = this.state;

    return (
      <>
        <GoogleApiLoader apiKey="AIzaSyCaMRWqlcMu96wUqotTCAwxNXPIH8Rif6c">
          <Map
            onClick={(e) => console.log(e) || this.refs.map.leafletElement.locate()}
            onLocationFound={this.onClickLocation}
            center={position}
            zoom={zoom}
            style={{height: '100vh'}}
            ref="map"
          >
            <LayersControl position='topright'>
              <BaseLayer checked name='Google Maps Roads'>
                <GoogleMutant type="roadmap"/>
              </BaseLayer>
              <BaseLayer name='Google Maps Satellite'>
                <GoogleMutant type="satellite" />
              </BaseLayer>
            </LayersControl>
            {this.renderMarkers()}
          </Map>
        </GoogleApiLoader>
      </>
    );
  };
}

export default App;
