const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");


registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    registerMessage.innerText =
        "Creating account...";


    try {

        const response = await fetch(
            "http://localhost:3000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            registerMessage.innerText =
                data.message || "Registration failed";

            return;
        }


        registerMessage.innerText =
            "Account created successfully. Redirecting to login...";


        registerForm.reset();


        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);


    } catch (error) {

        console.error(error);

        registerMessage.innerText =
            "Unable to connect to server.";

    }

});