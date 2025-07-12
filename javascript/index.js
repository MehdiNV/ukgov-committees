const API_URL = "https://committees-api.parliament.uk/committeeMeetings?fromDate=2025-07-01&toDate=2025-08-01";

async function fetchMeetings() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    displayMeetings(data.items);
  } catch (error) {
    document.getElementById("meetings").innerHTML = "<p>Error loading data.</p>";
    console.error("Fetch error:", error);
  }
}

function displayMeetings(meetings) {
  const container = document.getElementById("meetings");
  container.innerHTML = ""; // clear loading message

  if (meetings.length === 0) {
    container.innerHTML = "<p>No upcoming meetings found.</p>";
    return;
  }

  meetings.forEach(meeting => {
    const div = document.createElement("div");
    div.className = "meeting-card";

    const date = new Date(meeting.meetingDate).toLocaleString();

    div.innerHTML = `
      <h2>${meeting.committeeName}</h2>
      <p><strong>Topic:</strong> ${meeting.meetingTitle || "N/A"}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Location:</strong> ${meeting.location || (meeting.isRemote ? "Remote" : "TBA")}</p>
      ${meeting.broadcast?.webcastUrl ? `<p><a href="${meeting.broadcast.webcastUrl}" target="_blank">Watch Live</a></p>` : ""}
    `;

    container.appendChild(div);
  });
}

fetchMeetings();
