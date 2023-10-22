document.addEventListener("DOMContentLoaded", function () {
  const registerFormContainer = document.getElementById("registerFormContainer");
  const loginFormContainer = document.getElementById("loginFormContainer");
  const gameContainer = document.getElementById("gameContainer");
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const showLoginBtn = document.getElementById("showLoginBtn");
  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const token = localStorage.getItem("token");

  if (token !== null) {
    registerFormContainer.style.display = "none";
    loginFormContainer.style.display = "none";
    gameContainer.style.display = "block";
  } else {
    registerFormContainer.style.display = "none";
    loginFormContainer.style.display = "block";
    gameContainer.style.display = "none";
  }

  showLoginBtn.addEventListener("click", function () {
    registerFormContainer.style.display = "none";
    loginFormContainer.style.display = "block";
    gameContainer.style.display = "none";
  });

  showRegisterBtn.addEventListener("click", function () {
    registerFormContainer.style.display = "block";
    loginFormContainer.style.display = "none";
    gameContainer.style.display = "none";
  });

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const nama = document.getElementById("registerName").value;

    // Validasi email, password, dan nama
    if (!validateEmail(email)) {
      alert("Email tidak valid. Pastikan menggunakan format email yang benar.");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password tidak memenuhi kriteria. Pastikan terdapat setidaknya 1 huruf besar, 1 angka, 1 huruf kecil, dan 1 simbol.");
      return;
    }

    if (!validateName(nama)) {
      alert("Nama tidak valid. Silakan isi dengan nama lengkap Anda.");
      return;
    }

    // Simulasikan proses registrasi
    const registrationData = { email, password, nama };
     try {
      const response = await fetch("https://ets-pemrograman-web-f.cyclic.app/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
       
       console.log(response)

      if (response.status === 201) {
        alert("Registrasi berhasil!");
        registerFormContainer.style.display = "none";
        localStorage
      } else {
        alert("Registrasi gagal. Silakan coba lagi.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim permintaan registrasi.");
    }
  });

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Simulasikan proses login
    const loginData = { email, password };
    const response = await fetch("https://ets-pemrograman-web-f.cyclic.app/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (response.status === 200) {
      alert("Login berhasil!");
      localStorage.setItem("token", data.data.access_token);
      loginFormContainer.style.display = "none";
      gameContainer.style.display = "block";
    } else {
      alert("Login gagal. Email atau password salah.");
    }
  });

  // Fungsi validasi email
  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  // Fungsi validasi password
  function validatePassword(password) {
    // Minimal 1 huruf besar, 1 angka, 1 huruf kecil, dan 1 simbol
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{};:<>|./?,-]).{8,}$/;
    return passwordRegex.test(password);
  }

  // Fungsi validasi nama
  function validateName(name) {
    // Hanya memeriksa apakah tidak kosong
    return name.trim() !== "";
  }
});
