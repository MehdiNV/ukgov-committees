// index.js

// Fetch committee data and populate the select dropdown
async function loadCommittees() {
  console.log("Trying to fetch Commmittees from API...");


  try {
    const res = await fetch("https://corsproxy.io/?https://committees-api.parliament.uk/api/Committees");
    const data = await res.json();

    const select = document.getElementById("committee-select");
    select.innerHTML = ""; // clear any existing options

    data.items.forEach(committee => {
      const option = document.createElement("option");
      option.value = committee.id;
      option.textContent = committee.name;
      select.appendChild(option);
    });

    // Re-initialize or refresh Bootstrap Select
    $('.selectpicker').selectpicker('refresh');

  } catch (err) {
    console.error("Error loading committees:", err);
  }
}

// Listen for user selections
function handleSelectionChange() {
  $('#committee-select').on('changed.bs.select', function () {
    const selectedIds = $(this).val(); // Array of selected committee IDs
    console.log("Selected committee IDs:", selectedIds);

    // You could trigger a meeting fetch here:
    // loadMeetings(selectedIds);
  });
}

// Init everything when
document.addEventListener("DOMContentLoaded", () => {
  loadCommittees();
  handleSelectionChange();
});
