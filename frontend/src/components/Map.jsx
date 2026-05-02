import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1673/1673188.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

const mechIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

// Component to handle map centering and movement
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 13, { duration: 1.5 });
    }
  }, [center, map, zoom]);
  return null;
}

export default function Map({ mechanics, selectedMechanic, onSelectMechanic, userLoc }) {
  const mapRef = useRef();

  return (
    <MapContainer 
      center={[20.5937, 78.9629]} 
      zoom={5} 
      style={{ height: '100%', width: '100%' }}
      className="z-0"
      whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Center on Selected Mechanic */}
      {selectedMechanic && (
        <MapController center={[selectedMechanic.lat, selectedMechanic.lng]} zoom={14} />
      )}

      {/* Center on User when GPS is found */}
      {userLoc && (
        <MapController center={[userLoc.lat, userLoc.lng]} zoom={12} />
      )}

      {/* User Marker */}
      {userLoc && (
        <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
          <Popup className="custom-popup">
            <div className="font-bold text-indigo-600">You are here</div>
          </Popup>
        </Marker>
      )}

      {/* Mechanic Markers */}
      {mechanics.map((m) => (
        <Marker 
          key={m.id} 
          position={[m.lat, m.lng]} 
          icon={mechIcon}
          eventHandlers={{
            click: () => onSelectMechanic(m),
          }}
        >
          <Popup className="custom-popup">
            <div className="p-1">
              <div className="font-bold text-[#0F172A]">{m.name}</div>
              <div className="text-xs text-[#64748B] mb-2">{m.address}</div>
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
                   {m.distance > 0 ? `${m.distance} mi away` : 'Locating...'}
                 </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
