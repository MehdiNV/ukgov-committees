// === Utility: Format date ===
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getFutureDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split("T")[0];
}

// === Load all committees ===
async function loadCommittees() {
  try {
    const res = await fetch("https://corsproxy.io/?https://committees-api.parliament.uk/api/Committees?Take=200");
    const data = await res.json();

    const select = document.getElementById("committee-select");
    select.innerHTML = ""; // clear any existing options

    data.items.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      select.appendChild(opt);
    });

    // Refresh the Bootstrap Select UI
    $('.selectpicker').selectpicker('refresh');
  } catch (err) {
    console.error("Error loading committees:", err);
    alert("Failed to load committees.");
  }
}

// === Fetch meetings for selected committee IDs ===
async function fetchMeetings(committeeIds = []) {
  if (committeeIds.length === 0) {
    alert("Please select at least one committee.");
    return;
  }

  const fromDate = getTodayDate();
  let url = `https://corsproxy.io/?https://committees-api.parliament.uk/api/Events?startDateFrom=${fromDate}`;

  const allMeetings = [];

  try {
      for (const id of committeeIds) {
        const url = `https://corsproxy.io/?https://committees-api.parliament.uk/api/Events?startDateFrom=${fromDate}&committeeId=${id}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.items && Array.isArray(data.items)) {
          allMeetings.push(...data.items);
        }
      }

      // Optional: sort by date
      allMeetings.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      // Render all combined results
      renderMeetings(allMeetings);
    } catch (err) {
      console.error("Error fetching meetings:", err);
      alert("Failed to fetch meetings. Please try again.");
    }
  }

function renderMeetings(meetings) {
  const container = document.getElementById("meeting-results");
  container.innerHTML = ""; // Clear previous results

  if (meetings.length === 0) {
    container.innerHTML = `<p class="text-muted">No upcoming meetings found.</p>`;
    return;
  }

  console.log("Meetings data is...");
  console.log(meetings);

  meetings.forEach(meeting => {
    const card = document.createElement("div");
    card.className = "card mb-3";

    const startDate = new Date(meeting.startDate).toLocaleString();
    const endDate = new Date(meeting.endDate).toLocaleString();


    const committee = meeting.committees?.[0];
    const committeeName = committee?.name || "Unknown Committee";
    const committeeLink = committee?.websiteLegacyUrl || "#";

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${committeeName}</h5>
        <h5 class="card-title">${meeting.eventType.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${startDate}</h6>
        <h6 class="card-subtitle mb-2 text-muted">${endDate}</h6>
        <p class="card-text"><strong>Topic:</strong> ${meeting.committeeBusinesses[0]?.title || "N/A"}</p>
        <p class="card-text"><strong>Location:</strong> ${meeting.location || (meeting.isRemote ? "Remote" : "TBA")}</p>
        ${committeeLink ? `<a href="${committeeLink}" class="card-link" target="_blank">Visit Committee Page</a>` : ""}
      </div>
    `;

    container.appendChild(card);
  });
}

// === Event Binding ===
document.addEventListener("DOMContentLoaded", () => {
  loadCommittees();

  // Button click: fetch meetings
  document.getElementById("fetch-meetings-btn").addEventListener("click", () => {
    const selected = $("#committee-select").val(); // get selected values
    fetchMeetings(selected);
  });
});
