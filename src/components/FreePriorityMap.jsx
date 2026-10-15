import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const complaints = [
  { id: 1, title: "Road Damage", ward: 8, score: 86, lat: 26.8105, lng: 82.738 },
  { id: 2, title: "Drainage Blockage", ward: 14, score: 94, lat: 26.803, lng: 82.748 },
  { id: 3, title: "Streetlight Issue", ward: 21, score: 62, lat: 26.798, lng: 82.735 }
];

function getSavedZoom() {
  try {
    const settings = JSON.parse(
      localStorage.getItem("jansetu_settings_v1") || "{}"
    );
    return Number(settings.mapZoom) || 13;
  } catch {
    return 13;
  }
}

export default function FreePriorityMap() {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-3 text-xl font-bold">Basti Civic Priority Map</h2>

      <MapContainer
        center={[26.8065, 82.7421]}
        zoom={getSavedZoom()}
        style={{ height: "420px", width: "100%", zIndex: 0, borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {complaints.map((item) => (
          <CircleMarker
            key={item.id}
            center={[item.lat, item.lng]}
            radius={12}
            pathOptions={{
              color: item.score >= 90 ? "red" : "orange",
              fillOpacity: 0.7
            }}
          >
            <Popup>
              <strong>{item.title}</strong>
              <p>Ward: {item.ward}</p>
              <p>AI Priority: {item.score}/100</p>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <p className="mt-2 text-xs text-gray-500">
        Sample complaint locations for demonstration.
      </p>
    </div>
  );
}