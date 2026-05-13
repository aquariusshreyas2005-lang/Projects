document.addEventListener("DOMContentLoaded", () => {
  const userEmail = localStorage.getItem("loggedInUser");

  if (document.getElementById("userWelcome")) {
    if (!userEmail) {
      window.location.href = "index.html";
      return;
    }

    document.getElementById("userWelcome").textContent = `Welcome, ${userEmail}`;
    loadPasses();

    document.getElementById("passForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const id = document.getElementById("id").value;
      const passType = document.getElementById("passType").value;
      const issueDate = new Date();
      const expiryDate = calculateExpiry(passType);

      const passData = {
        email: userEmail,
        name,
        id,
        passType,
        date: issueDate.toLocaleDateString(), // For display
        expiry: expiryDate.toISOString()      // ✅ Store in ISO format
      };

      const passes = JSON.parse(localStorage.getItem("busPasses") || "[]");

      // ✅ Find existing pass with same email and ID
      const index = passes.findIndex(p => p.id === id && p.email === userEmail);

      if (index !== -1) {
        passes[index] = passData; // ✅ Update existing
      } else {
        passes.push(passData);    // ✅ Add new
      }

      localStorage.setItem("busPasses", JSON.stringify(passes));
      document.getElementById("passForm").reset();

      // ✅ Redirect to animated renewal page (or show success)
      window.location.href = "renewing.html";
    });
  }
});

function calculateExpiry(type) {
  const date = new Date();
  if (type === "monthly") date.setMonth(date.getMonth() + 1);
  else if (type === "quarterly") date.setMonth(date.getMonth() + 3);
  return date;
}

function loadPasses() {
  const list = document.getElementById("passList");
  const passes = JSON.parse(localStorage.getItem("busPasses") || "[]");
  const user = localStorage.getItem("loggedInUser");

  const userPasses = passes.filter(p => p.email === user);
  list.innerHTML = "";

  userPasses.forEach(p => {
    const expiryDate = new Date(p.expiry);       // ✅ Parse ISO date
    const now = new Date();
    const status = expiryDate >= now ? "✅ Active" : "❌ Expired";

    const div = document.createElement("div");
    div.classList.add("pass");
    div.innerHTML = `
      <strong>${p.name}</strong><br>ID: ${p.id}<br>
      Type: ${p.passType}<br>
      Issued: ${p.date}<br>
      Expires: ${expiryDate.toLocaleDateString()} (${status})
    `;
    list.appendChild(div);
  });
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
