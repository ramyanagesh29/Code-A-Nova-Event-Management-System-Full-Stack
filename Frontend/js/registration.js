const token =
    localStorage.getItem("token");

const role =
    localStorage.getItem("role");

const eventDetails =
    document.getElementById("eventDetails");

const registrationMessage =
    document.getElementById("registrationMessage");

const confirmButton =
    document.getElementById("confirmRegistration");


// User must be logged in
if (!token) {

    alert("Please login first.");

    window.location.href = "login.html";
}


// Only students can register
if (role !== "student") {

    alert("Only students can register for events.");

    window.location.href = "events.html";
}


// Get event ID from URL

const params =
    new URLSearchParams(window.location.search);

const eventId =
    params.get("eventId");


if (!eventId) {

    eventDetails.innerHTML =
        "<p>No event selected.</p>";

    confirmButton.style.display = "none";

} else {

    loadEvent();

}


// LOAD EVENT DETAILS

async function loadEvent() {

    try {

        const response = await fetch(
            `http://localhost:3000/api/events/${eventId}`
        );


        const event = await response.json();


        if (!response.ok) {

            eventDetails.innerHTML =
                `<p>${event.message}</p>`;

            confirmButton.style.display = "none";

            return;
        }


        const eventDate =
            new Date(event.date).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        eventDetails.innerHTML = `

            <h3>${event.title}</h3>

            <p>
                ${event.description}
            </p>

            <p>
                <strong>Category:</strong>
                ${event.category}
            </p>

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

        `;


    } catch (error) {

        console.error(error);

        eventDetails.innerHTML =
            "<p>Unable to load event details.</p>";

    }

}


// REGISTER STUDENT FOR EVENT

confirmButton.addEventListener(
    "click",
    async function () {

        confirmButton.disabled = true;

        registrationMessage.innerText =
            "Registering...";


        try {

            const response = await fetch(
                `http://localhost:3000/api/registrations/${eventId}`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                registrationMessage.innerText =
                    data.message ||
                    "Registration failed";

                confirmButton.disabled = false;

                return;
            }


            registrationMessage.innerText =
                "Event registration successful!";


            setTimeout(() => {

                window.location.href =
                    "student-dashboard.html";

            }, 1500);


        } catch (error) {

            console.error(error);

            registrationMessage.innerText =
                "Unable to connect to server.";

            confirmButton.disabled = false;

        }

    }
);


// LOGOUT

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