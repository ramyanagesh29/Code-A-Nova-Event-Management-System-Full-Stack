const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const userName = localStorage.getItem("userName");


// -------------------------
// PROTECT DASHBOARD
// -------------------------

if (!token) {

    alert("Please login first.");

    window.location.href = "login.html";

}

if (role !== "student") {

    alert("Student access only.");

    window.location.href = "login.html";

}


// -------------------------
// DISPLAY STUDENT NAME
// -------------------------

document.getElementById("studentName").innerText =
    userName || "Student";


// -------------------------
// LOAD REGISTRATIONS
// -------------------------

async function loadRegistrations() {

    const container =
        document.getElementById("myEventsContainer");

    try {

        const response = await fetch(
            "http://localhost:3000/api/registrations/my/events",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );


        const registrations =
            await response.json();


        if (!response.ok) {

            container.innerHTML = `
                <p>
                    ${registrations.message ||
                    "Unable to load registrations"}
                </p>
            `;

            return;
        }


        // -------------------------
        // DASHBOARD STATISTICS
        // -------------------------

        const activeRegistrations =
            registrations.filter(
                registration =>
                    registration.status === "registered"
            );

        const cancelledRegistrations =
            registrations.filter(
                registration =>
                    registration.status === "cancelled"
            );


        document.getElementById(
            "totalRegistrations"
        ).innerText = registrations.length;


        document.getElementById(
            "activeRegistrations"
        ).innerText = activeRegistrations.length;


        document.getElementById(
            "cancelledRegistrations"
        ).innerText = cancelledRegistrations.length;


        // -------------------------
        // DISPLAY EVENTS
        // -------------------------

        container.innerHTML = "";


        if (registrations.length === 0) {

            container.innerHTML = `

                <div class="no-events">

                    <p>
                        You haven't registered for any events yet.
                    </p>

                    <a href="events.html" class="btn">
                        Explore Events
                    </a>

                </div>
            `;

            return;
        }


        registrations.forEach(registration => {

            const event = registration.event;


            if (!event) {
                return;
            }


            const card =
                document.createElement("div");

            card.classList.add("event-card");


            const eventDate =
                new Date(event.date)
                    .toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    );


            card.innerHTML = `

                <h2>
                    ${event.title}
                </h2>


                <p>
                    <strong>Date:</strong>
                    ${eventDate}
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
                    <strong>Status:</strong>

                    <span class="
                        registration-status
                        ${registration.status}
                    ">

                        ${registration.status.toUpperCase()}

                    </span>

                </p>


                ${
                    registration.status === "registered"

                    ?

                    `
                    <button
                        type="button"
                        onclick="cancelRegistration(
                            '${registration._id}'
                        )"
                    >
                        Cancel Registration
                    </button>
                    `

                    :

                    `
                    <p>
                        This registration was cancelled.
                    </p>
                    `
                }

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        container.innerHTML = `
            <p>
                Unable to connect to the server.
            </p>
        `;

    }

}


// -------------------------
// CANCEL REGISTRATION
// -------------------------

async function cancelRegistration(registrationId) {

    const confirmation = confirm(
        "Are you sure you want to cancel this registration?"
    );


    if (!confirmation) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:3000/api/registrations/${registrationId}/cancel`,
            {
                method: "PUT",

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
                "Unable to cancel registration"
            );

            return;
        }


        alert("Registration cancelled successfully.");


        // Reload dashboard data
        loadRegistrations();


    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }

}


// -------------------------
// LOGOUT
// -------------------------

document
    .getElementById("logoutButton")
    .addEventListener("click", function () {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");


        window.location.href =
            "login.html";

    });


// -------------------------
// INITIAL LOAD
// -------------------------

loadRegistrations();