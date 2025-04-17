let originMarker, destinationMarker, flightPath;

const updateFlight = () => {
  // lear previous markers and line
  if (planeMarker) map.removeLayer(planeMarker);
  if (originMarker) map.removeLayer(originMarker);
  if (destinationMarker) map.removeLayer(destinationMarker);
  if (flightPath) map.removeLayer(flightPath);  // Ensure flight path is removed

  // Clear previous flight info
  document.getElementById("flightInfo").innerHTML = "";

  // Add new markers
  originMarker = L.marker(coords.origin).addTo(map)
    .bindPopup(`<b>Origin:</b> ${originCityRaw}<br><b>Airport:</b> ${originAirport.name}`);
  destinationMarker = L.marker(coords.destination).addTo(map)
    .bindPopup(`<b>Destination:</b> ${destinationCityRaw}<br><b>Airport:</b> ${destinationAirport.name}`);

  //  Draw new flight path and ensure it is properly added to the map
  flightPath = L.polyline([coords.origin, coords.destination], {
    color: "blue",
    weight: 4,
  }).addTo(map);
  map.fitBounds(flightPath.getBounds());

  // Place plane marker in the middle
  const midLat = (coords.origin[0] + coords.destination[0]) / 2;
  const midLng = (coords.origin[1] + coords.destination[1]) / 2;
  planeMarker = L.marker([midLat, midLng]).addTo(map);

  // Update flight info panel and clear any previous content
  document.getElementById("flightInfo").innerHTML = `
    <strong>Route:</strong> ${randomFlight.origin_city} → ${randomFlight.destination_city}<br>
    <strong>Distance:</strong> ${randomFlight.distance_miles} miles<br>
    <strong>Airlines:</strong> ${randomFlight.airlines_serving.join(", ")}<br>
    <strong>Flights per day:</strong> ${randomFlight.flights_per_day}<br>
    <strong>Best time to book:</strong> ${randomFlight.best_time_to_book_days} days before<br><br>
    <strong>Average Prices:</strong><br>
    Economy: $${randomFlight.average_price.economy}<br>
    Premium Economy: $${randomFlight.average_price.premium_economy}<br>
    Business: $${randomFlight.average_price.business}<br>
    First: $${randomFlight.average_price.first}<br>
    <strong>Average Duration:</strong> ${randomFlight.average_duration_minutes} minutes
  `;
};
