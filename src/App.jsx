import { useState, useRef, useMemo } from 'react'
import { useLoadScript, GoogleMap, InfoWindow, Marker} from '@react-google-maps/api'
import './App.css'
import markers from './markers.js'
import { Carousel, Modal } from 'flowbite-react';

function App() {
  const [showDetailWindow, setShowDetailWindow] = useState(false);
  const [infoWindowId, setInfoWindowId] = useState();
  const [mapRef, setMapRef] = useState();


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: '',
  });
  const center = useMemo(() => ({ lat: 20.310548, lng: -101.621259 }), []);

  const markerClickHandle = (lat, lng, markerId) => {
    mapRef?.panTo({lat, lng});
    setShowDetailWindow(true);
    setInfoWindowId(markerId);
  } 

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new google.maps.LatLngBounds();
    markers?.forEach(({lat, lng}) => bounds.extend({lat, lng}));
    map.fitBounds(bounds);
  }

  return (
    <>
      <div className="App">
        {!isLoaded ? '' :
        <GoogleMap onLoad={onMapLoad} mapContainerClassName="map-container" center={center} zoom={6} options={{mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}}>
          {markers.map((marker, index) => {
            return (<Marker key={index} onClick={() => {markerClickHandle(marker.lat, marker.lng, index)}} position={{ lat: marker.lat, lng: marker.lng }} icon={'http://ronival.com/marker.png'} >
              {showDetailWindow && infoWindowId == index &&
              <InfoWindow>
                  <h3>{marker.name}</h3>
              </InfoWindow>}
            </Marker>);
          })}
        </GoogleMap>
        
        }
      </div>

      <Modal position={"center-left"} show={showDetailWindow} size="md" onClose={() => setShowDetailWindow(false)}>
        <Modal.Header>{markers[infoWindowId] ? markers[infoWindowId].name : ''}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 text-justify">
              {markers[infoWindowId] ? markers[infoWindowId].description : ''}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default App;



