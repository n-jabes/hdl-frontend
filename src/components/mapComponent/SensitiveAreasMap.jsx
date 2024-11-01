import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  Circle,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import mapStyles from '../../utils/mapStyles';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const blueIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
const redIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

// Default coordinates for Kigali
const defaultCenter = {
  lat: -1.9577,
  lng: 30.1127,
};

// Styles for geofence circle
const defaultOptions = {
  strokeWeight: 0.9,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

const greenOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.15,
  strokeColor: '#1279ff',
  fillColor: '#1279ff',
};

const SensitiveAreasMap = ({subscriberCoordinates}) => {

  // console.log("subscriberCoordinates: ", subscriberCoordinates)
  const [sensitiveAreas, setSensitiveAreas] = useState([]);
  const mapRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: 'f147f16e33a7b0e0',
    googleMapsApiKey: 'AIzaSyDJOXNvQcvI8m7BdR5bc4xmDvxE_wly5Sg',
  });

  // Parse and clean coordinate values
  const parseCoordinate = (coord) => {
    // Remove whitespace and convert to number
    const parsedCoord = parseFloat(String(coord).trim());
    
    // Validate that it's a valid number
    return !isNaN(parsedCoord) ? parsedCoord : null;
  };

  // Load sensitive areas from local storage on component mount
  useEffect(() => {
    try {
      const storedAreas = JSON.parse(localStorage.getItem('sensitiveAreas') || '[]');
      
      // Filter and clean areas with valid coordinates
      const validAreas = storedAreas.filter(area => {
        const lat = parseCoordinate(area.latitude);
        const lng = parseCoordinate(area.longitude);
        return lat !== null && lng !== null;
      }).map(area => ({
        ...area,
        latitude: parseCoordinate(area.latitude),
        longitude: parseCoordinate(area.longitude)
      }));

      setSensitiveAreas(validAreas);
    } catch (error) {
      console.error('Error loading sensitive areas from local storage:', error);
      setSensitiveAreas([]);
    }
  }, []);

  const onLoad = useCallback((map) => {
    mapRef.current = map; // Store the map instance in the ref
  }, []);

  // Determine map center based on coordinates or use default
  const center = subscriberCoordinates.length > 0 
    ? {
        lat: subscriberCoordinates[0].lat, 
        lng: subscriberCoordinates[0].lng
      } 
    : (sensitiveAreas.length > 0 
      ? {
          lat: sensitiveAreas[0].latitude, 
          lng: sensitiveAreas[0].longitude
        } 
      : defaultCenter);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      center={center}
      zoom={12}
      options={{ streetViewControl: false, styles: mapStyles }}
    >
      {/* Render Sensitive Areas */}
      {sensitiveAreas.map((area, index) => (
        <React.Fragment key={`sensitive-${index}`}>
          {/* Marker for each sensitive area */}
          <Marker 
            position={{
              lat: area.latitude, 
              lng: area.longitude
            }} 
            icon={blueIcon} 
          />
          
          {/* Geofence circle around each marker */}
          <Circle
            center={{
              lat: area.latitude, 
              lng: area.longitude
            }}
            radius={1500} // You can make this configurable per area if needed
            options={greenOptions}
          />
        </React.Fragment>
      ))}

      {/* Render Subscriber Coordinates */}
      {subscriberCoordinates.map((subscriber, index) => (
        <Marker 
          key={`subscriber-${index}`}
          position={{
            lat: subscriber.lat, 
            lng: subscriber.lng
          }} 
          icon={redIcon}
          title={subscriber.fullNames} // Optional: show name on hover
        />
      ))}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

export default SensitiveAreasMap;