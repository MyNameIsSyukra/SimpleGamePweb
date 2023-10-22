document.getElementById("register-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const nama = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  data = JSON.stringify({ nama, email, password });
  await fetch("https://ets-pemrograman-web-f.cyclic.app/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((response) => {
      resp = response.json();
      if (response.ok) {
        location = "/login.html";
      } else {
        alert("Failed to register");
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      }
    })
    .catch((error) => {
      alert("Error:", error);
    });
});
