const form = document.getElementById("signupForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const response = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      window.location.href = "signin.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Error signing up");
  }
});
