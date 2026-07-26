const API_URL = "http://localhost:3000/api/events";

async function loadEvents() {

    const container = document.getElementById("eventsContainer");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load events");
        }

        const events = await response.json();

        container.innerHTML = "";

        if (events.length === 0) {

            container.innerHTML = `
                <p>No events are currently available.</p>
            `;

            return;
        }


        events.forEach(event => {

            const card = document.createElement("div");

            card.classList.add("event-card");


            const eventDate =
                new Date(event.date).toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );


            card.innerHTML = `

                <h2>${event.title}</h2>

                <p>${event.description}</p>

                <ul>

                    <li>
                        <strong>Category:</strong>
                        ${event.category}
                    </li>

                    <li>
                        <strong>Date:</strong>
                        ${eventDate}
                    </li>

                    <li>
                        <strong>Time:</strong>
                        ${event.time}
                    </li>

                    <li>
                        <strong>Venue:</strong>
                        ${event.venue}
                    </li>

                    <li>
                        <strong>Maximum Participants:</strong>
                        ${event.maxParticipants}
                    </li>

                </ul>

                <button
                    type="button"
                    onclick="registerForEvent('${event._id}')"
                >
                    Register Now
                </button>

            `;

            container.appendChild(card);

        });


    } catch (error) {

        console.error("Error loading events:", error);

        container.innerHTML = `
            <p>
                Unable to load events.
                Please make sure the backend server is running.
            </p>
        `;
    }
}


function registerForEvent(eventId) {

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Please login before registering for an event.");

        window.location.href = "login.html";

        return;
    }


    const role = localStorage.getItem("role");

    if (role !== "student") {

        alert("Only students can register for events.");

        return;
    }


    window.location.href =
        `registration.html?eventId=${eventId}`;
}


loadEvents();