let flights = [];
let currentPage = 1;
const rowsPerPage = 10;
const spinner = document.getElementById("loadingSpinner");
const flightDisplay = document.getElementById("flightDisplay");

// Fetch flight data
function fetchData() {
  spinner.style.display = "block";
  fetch("./API.json")
    .then((res) => res.json())
    .then((data) => {
      flights = extractUpcomingFlights(data.data);
      renderTableView(flights, currentPage);
    })
    .catch((err) => console.error("Fetch error:", err))
    .finally(() => {
      spinner.style.display = "none";
    });
}

function extractUpcomingFlights(data) {
  let result = [];
  data.airlines.forEach((airline) => {
    airline.routes.forEach((route) => {
      if (route.next_flight) {
        result.push({
          airline: airline.name,
          logo: airline.logo,
          origin: route.origin,
          destination: route.destination,
          flight_number: route.next_flight.flight_number,
          departure: route.next_flight.departure,
          arrival: route.next_flight.arrival,
          status: route.next_flight.status,
        });
      }
    });
  });
  return result;
}

// Render Table View
function renderTableView(data, page = 1) {
  flightDisplay.innerHTML = "";
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = data.slice(start, end);

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Airline</th>
        <th>Flight</th>
        <th>Origin</th>
        <th>Destination</th>
        <th>Departure</th>
        <th>Arrival</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${pageData
        .map(
          (f) => `
        <tr data-destination="${f.destination}">
          <td><img src="${f.logo}" alt="${f.airline}" width="40"> ${f.airline}</td>
          <td>${f.flight_number}</td>
          <td>${f.origin}</td>
          <td>${f.destination}</td>
          <td>${new Date(f.departure).toLocaleString()}</td>
          <td>${new Date(f.arrival).toLocaleString()}</td>
          <td>${f.status}</td>
        </tr>`
        )
        .join("")}
    </tbody>`;
  flightDisplay.appendChild(table);
  attachRowListeners();

  renderPagination(data.length);
}

// Render Grid View
function renderGridView(data) {
  flightDisplay.innerHTML = "";
  data.forEach((f, i) => {
    const card = document.createElement("div");
    card.className = "flight-card";
    card.style.animationDelay = `${i * 0.1}s`;
    card.setAttribute("data-destination", f.destination);
    card.innerHTML = `
      <h3>${f.airline}</h3>
      <p><strong>Flight:</strong> ${f.flight_number}</p>
      <p><strong>From:</strong> ${f.origin}</p>
      <p><strong>To:</strong> ${f.destination}</p>
      <p><strong>Departure:</strong> ${new Date(f.departure).toLocaleString()}</p>
      <p><strong>Arrival:</strong> ${new Date(f.arrival).toLocaleString()}</p>
      <p><strong>Status:</strong> ${f.status}</p>
    `;
    flightDisplay.appendChild(card);
  });
  attachCardListeners();
}

// Pagination Controls
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const wrapper = document.createElement("div");
  wrapper.className = "pagination";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTableView(flights, currentPage);
    }
  };

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTableView(flights, currentPage);
    }
  };

  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);
  flightDisplay.appendChild(wrapper);
}

function attachRowListeners() {
  document.querySelectorAll("tr[data-destination]").forEach((row) => {
    row.addEventListener("click", () => {
      updateDestinationImage(row.dataset.destination);
    });
  });
}

function attachCardListeners() {
  document.querySelectorAll(".flight-card").forEach((card) => {
    card.addEventListener("click", () => {
      updateDestinationImage(card.dataset.destination);
    });
  });
}

// Button handlers
document.getElementById("tableViewBtn").addEventListener("click", () => {
  flightDisplay.classList.add("table-view");
  flightDisplay.classList.remove("grid-view");
  renderTableView(flights, currentPage);
});

document.getElementById("gridViewBtn").addEventListener("click", () => {
  flightDisplay.classList.add("grid-view");
  flightDisplay.classList.remove("table-view");
  renderGridView(flights);
});

// Init
fetchData();
