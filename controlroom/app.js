const SHEET_URL =
"https://opensheet.elk.sh/1Ofvy5jY1RZFqID6BS6XPfkFvZGR8HKbLJHtikaWmRoI/move";

let rawData = [];

fetch(SHEET_URL)
  .then(res => res.json())
  .then(data => {
    rawData = data;
    populateFilters(data);
    renderTable(data);
  });

function populateFilters(data) {

  const trainSet = new Set();
  const engineSet = new Set();

  data.forEach(r => {
    trainSet.add(r["TRAIN NO"]?.trim());
    engineSet.add(r["ENGINE NO"]?.trim());
  });

  trainSet.forEach(t =>
    trainFilter.innerHTML += `<option value="${t}">${t}</option>`
  );

  engineSet.forEach(e =>
    engineFilter.innerHTML += `<option value="${e}">${e}</option>`
  );

  document
    .querySelectorAll(".filters select, .filters input")
    .forEach(el => el.onchange = applyFilters);
}

function applyFilters() {

  const date = dateFilter.value;
  const train = trainFilter.value;
  const engine = engineFilter.value;
  const direction = directionFilter.value;

  const filtered = rawData.filter(r =>
    (!date || r["DATE"] === formatDate(date)) &&
    (!train || r["TRAIN NO"]?.trim() === train) &&
    (!engine || r["ENGINE NO"]?.trim() === engine) &&
    (!direction || r["DIRECTION"] === direction)
  );

  renderTable(filtered);
}

function formatDate(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  }).replace(/ /g, "-");
}

function renderTable(data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r["DATE"]}</td>
        <td>${r["TRAIN NO"]}</td>
        <td>${r["ENGINE NO"]}</td>
        <td>${r["DIRECTION"]}</td>
        <td>${r["DELAY HRS"]}</td>
        <td>${r["TOTAL DETENTION HOURS"]}</td>
        <td>${r["DETENTION REASON"]}</td>
      </tr>`;
  });
}

