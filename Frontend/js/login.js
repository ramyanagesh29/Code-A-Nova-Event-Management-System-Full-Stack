const loginForm = document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    loginMessage.innerText = "Logging in...";


    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            loginMessage.innerText =
                data.message || "Login failed";

            return;
        }


        // Store authentication information
        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.user.role
        );

        localStorage.setItem(
            "userName",
            data.user.name
        );

        localStorage.setItem(
            "userId",
            data.user.id
        );


        loginMessage.innerText =
            "Login successful";


        // Redirect based on user role

        if (data.user.role === "admin") {

            window.location.href =
                "dashboard.html";

        } else {

            window.location.href =
                "student-dashboard.html";

        }


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        loginMessage.innerText =
            "Unable to connect to the server.";

    }

});