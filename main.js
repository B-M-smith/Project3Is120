// Initialize map
let map = L.map("map").setView([39.8283, -98.5795], 4);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(map);

let planeMarker;
let routeLine;

async function trackRandomFlight() {
  try {
    const res = await fetch("https://flights.is120.ckearl.com");
    const data = await res.json();
    const randomRoute = data.popular_routes[Math.floor(Math.random() * data.popular_routes.length)];

    const { route_id, origin_city, destination_city, distance_miles, airlines_serving, flights_per_day, average_price, average_duration_minutes, best_time_to_book_days } = randomRoute;

    // Get airport location data
    const originAirport = data.airports.find(airport =>
      airport.iata_code === route_id.split("-")[0]
    );
    const destinationAirport = data.airports.find(airport =>
      airport.iata_code === route_id.split("-")[1]
    );

    if (!originAirport || !destinationAirport) {
      console.error("Missing airport data.");
      return;
    }

    const originCoords = [originAirport.location.latitude, originAirport.location.longitude];
    const destinationCoords = [destinationAirport.location.latitude, destinationAirport.location.longitude];

    if (planeMarker) map.removeLayer(planeMarker);
    if (routeLine) map.removeLayer(routeLine);

    // Draw the route
    routeLine = L.polyline([originCoords, destinationCoords], { color: "blue" }).addTo(map);
    map.fitBounds(routeLine.getBounds());

    // Add plane marker to origin
    planeMarker = L.marker(originCoords).addTo(map);

    // Display flight info
    document.getElementById("flightInfo").innerHTML = `
      <h3>${origin_city} → ${destination_city}</h3>
      <strong>Route ID:</strong> ${route_id}<br>
      <strong>Distance:</strong> ${distance_miles} miles<br>
      <strong>Airlines:</strong> ${airlines_serving.join(", ")}<br>
      <strong>Flights/Day:</strong> ${flights_per_day}<br>
      <strong>Book ${best_time_to_book_days} days ahead</strong><br><br>
      <strong>Prices:</strong><br>
      Economy: $${average_price.economy}<br>
      Premium: $${average_price.premium_economy}<br>
      Business: $${average_price.business}<br>
      First: $${average_price.first}<br>
      <strong>Duration:</strong> ${average_duration_minutes} min
    `;
  } catch (err) {
    console.error("Error loading flight data:", err);
    alert("Failed to load flight data. Please try again later.");
  }
}

document.getElementById("trackRandomFlight-btn").addEventListener("click", trackRandomFlight);
