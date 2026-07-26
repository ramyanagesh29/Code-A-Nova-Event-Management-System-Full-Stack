const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const userName = localStorage.getItem("userName");


// ===============================
// PROTECT ADMIN DASHBOARD
// ===============================

if (!token || role !== "admin") {

    alert("Admin access only.");

    window.location.href = "login.html";

}


document.getElementById("adminName").innerText =
    userName || "Admin";


// ===============================
// DASHBOARD STATISTICS
// ===============================

async function loadDashboard() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/admin/dashboard",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            console.error(data.message);

            return;
        }


        document.getElementById(
            "totalStudents"
        ).innerText = data.totalStudents;


        document.getElementById(
            "totalEvents"
        ).innerText = data.totalEvents;


        document.getElementById(
            "totalRegistrations"
        ).innerText = data.totalRegistrations;


        document.getElementById(
            "cancelledRegistrations"
        ).innerText = data.cancelledRegistrations;


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// ===============================
// LOAD EVENTS
// ===============================

async function loadEvents() {

    const container =
        document.getElementById(
            "adminEventsContainer"
        );


    try {

        const response = await fetch(
            "http://localhost:3000/api/events"
        );


        const events = await response.json();


        container.innerHTML = "";


        if (events.length === 0) {

            container.innerHTML =
                "<p>No events available.</p>";

            return;
        }


        events.forEach(event => {

            const card =
                document.createElement("div");

            card.classList.add("event-card");


            const date =
                new Date(event.date)
                    .toLocaleDateString("en-IN");


            card.innerHTML = `

                <h3>${event.title}</h3>

                <p>${event.description}</p>

                <p>
                    <strong>Category:</strong>
                    ${event.category}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${date}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${event.time}
                </p>

                <p>
                    <strong>Venue:</strong>
                    ${event.venue}
                </p>

                <p>
                    <strong>Capacity:</strong>
                    ${event.maxParticipants}
                </p>


                <button
                    onclick="editEvent('${event._id}')"
                >
                    Edit
                </button>


                <button
                    onclick="deleteEvent('${event._id}')"
                >
                    Delete
                </button>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load events.</p>";

    }

}


// ===============================
// SHOW EVENT FORM
// ===============================

const eventForm =
    document.getElementById("eventForm");


document
    .getElementById("showEventFormButton")
    .addEventListener("click", function () {

        eventForm.reset();

        document.getElementById(
            "eventId"
        ).value = "";

        eventForm.style.display = "block";

    });


// ===============================
// CREATE / UPDATE EVENT
// ===============================

eventForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "eventId"
            ).value;


        const eventData = {

            title:
                document.getElementById(
                    "eventTitle"
                ).value,

            description:
                document.getElementById(
                    "eventDescription"
                ).value,

            category:
                document.getElementById(
                    "eventCategory"
                ).value,

            date:
                document.getElementById(
                    "eventDate"
                ).value,

            time:
                document.getElementById(
                    "eventTime"
                ).value,

            venue:
                document.getElementById(
                    "eventVenue"
                ).value,

            maxParticipants:
                Number(
                    document.getElementById(
                        "maxParticipants"
                    ).value
                ),

            registrationDeadline:
                document.getElementById(
                    "registrationDeadline"
                ).value

        };


        const url = id

            ? `http://localhost:3000/api/events/${id}`

            : "http://localhost:3000/api/events";


        const method =
            id ? "PUT" : "POST";


        try {

            const response = await fetch(
                url,
                {
                    method,

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            "Bearer " + token

                    },

                    body:
                        JSON.stringify(eventData)
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                document.getElementById(
                    "eventMessage"
                ).innerText =
                    data.message ||
                    "Unable to save event";

                return;
            }


            document.getElementById(
                "eventMessage"
            ).innerText =
                id
                    ? "Event updated successfully."
                    : "Event created successfully.";


            eventForm.reset();

            eventForm.style.display =
                "none";


            await loadEvents();

            await loadDashboard();


        } catch (error) {

            console.error(error);

        }

    }
);


// ===============================
// EDIT EVENT
// ===============================

async function editEvent(id) {

    try {

        const response = await fetch(
            `http://localhost:3000/api/events/${id}`
        );


        const event =
            await response.json();


        if (!response.ok) {

            alert(event.message);

            return;
        }


        document.getElementById(
            "eventId"
        ).value = event._id;


        document.getElementById(
            "eventTitle"
        ).value = event.title;


        document.getElementById(
            "eventDescription"
        ).value = event.description;


        document.getElementById(
            "eventCategory"
        ).value = event.category;


        document.getElementById(
            "eventDate"
        ).value =
            event.date.split("T")[0];


        document.getElementById(
            "eventTime"
        ).value = event.time;


        document.getElementById(
            "eventVenue"
        ).value = event.venue;


        document.getElementById(
            "maxParticipants"
        ).value =
            event.maxParticipants;


        document.getElementById(
            "registrationDeadline"
        ).value =
            event.registrationDeadline
                .split("T")[0];


        eventForm.style.display =
            "block";


        eventForm.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);

    }

}


// ===============================
// DELETE EVENT
// ===============================

async function deleteEvent(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this event?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:3000/api/events/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to delete event"
            );

            return;
        }


        alert("Event deleted successfully.");


        await loadEvents();

        await loadDashboard();


    } catch (error) {

        console.error(error);

    }

}


// ===============================
// CANCEL EVENT FORM
// ===============================

document
    .getElementById("cancelEventButton")
    .addEventListener("click", function () {

        eventForm.reset();

        eventForm.style.display =
            "none";

    });


// ===============================
// LOAD REGISTRATIONS
// ===============================

async function loadRegistrations() {

    const container =
        document.getElementById(
            "registrationsContainer"
        );


    try {

        const response = await fetch(
            "http://localhost:3000/api/registrations",
            {
                headers: {
                    Authorization:
                        "Bearer " + token
                }
            }
        );


        const registrations =
            await response.json();


        if (!response.ok) {

            container.innerHTML = `
                <p>
                    ${registrations.message}
                </p>
            `;

            return;
        }


        container.innerHTML = "";


        if (registrations.length === 0) {

            container.innerHTML =
                "<p>No registrations yet.</p>";

            return;
        }


        registrations.forEach(registration => {

            const item =
                document.createElement("div");

            item.classList.add(
                "registration-card"
            );


            item.innerHTML = `

                <h3>
                    ${registration.event?.title || "Event"}
                </h3>

                <p>
                    <strong>Student:</strong>
                    ${registration.student?.name || "Unknown"}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${registration.student?.email || "-"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${registration.status}
                </p>

            `;


            container.appendChild(item);

        });


    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load registrations.</p>";

    }

}


// ===============================
// LOGOUT
// ===============================

document
    .getElementById("logoutButton")
    .addEventListener("click", function () {

        localStorage.clear();

        window.location.href =
            "login.html";

    });


// ===============================
// INITIAL LOAD
// ===============================

loadDashboard();

loadEvents();

loadRegistrations();