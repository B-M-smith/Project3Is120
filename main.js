// setup


fetch("https://flights.is120.ckearl.com")
	.then((response) => response.json())
	.then((dataObject) => {
		completeSteps(dataObject['data']);
	});



// Flight Tracker page 



import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const planeIcon = L.icon({
  iconUrl: "/plane-icon.png", // Replace with your own icon if needed
  iconSize: [40, 40],
});

const FlightTracker = ({ flightId }) => {
  const [position, setPosition] = useState(null);
  const [flightInfo, setFlightInfo] = useState(null);

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const res = await fetch(`https://flights.is120.ckearl.com/flight/${flightId}`);
        const data = await res.json();
        setPosition([data.latitude, data.longitude]);
        setFlightInfo(data);
      } catch (err) {
        console.error("Error fetching flight data:", err);
      }
    };

    fetchFlightData();
    const interval = setInterval(fetchFlightData, 15000); // update every 15s
    return () => clearInterval(interval);
  }, [flightId]);

  return (
    <div>
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {position && <Marker position={position} icon={planeIcon} />}
      </MapContainer>

      {flightInfo && (
        <div className="info-panel">
          <h2>{flightInfo.flightNumber}</h2>
          <p>From: {flightInfo.origin} → To: {flightInfo.destination}</p>
          <p>Altitude: {flightInfo.altitude} ft</p>
          <p>Speed: {flightInfo.speed} knots</p>
          <p>ETA: {flightInfo.estimatedArrival}</p>
        </div>
      )}
    </div>
  );
};

