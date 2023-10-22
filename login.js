function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

document.getElementById("login-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  // Get email and password input values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch("https://ets-pemrograman-web-f.cyclic.app/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      // Check if the response status is OK (status code 200)
      if (response.ok) {
        // Parse the JSON data from the response
        return response.json();
      } else {
        // Handle non-OK responses (e.g., handle errors)
        throw new Error("Request failed with status: " + response.status);
      }
    })
    .then((data) => {
      // Process the JSON data here
      console.log("Received data:", data);
      const accessToken = data.data.access_token;
      setCookie("token", accessToken, 1);
      location = "/game.html";
    })
    .catch((error) => {
      // Handle errors such as network issues or invalid JSON
      console.error("Error:", error);
    });
});
