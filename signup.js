document.getElementById("SignupForm").addEventListener("submit", async(e) => {
    e.preventDefault();

    const name = document.getElementById("SignupName").value.trim();
    const email = document.getElementById("SignupEmail").value.trim();
    const phone = document.getElementById("SignupPhone").value.trim();
    const password = document.getElementById("SignupPassword").value.trim();
    const role = document.getElementById("SignupRole").value;

    let valid = true;
    
    if (!name || name.length < 2) {
        document.getElementById("SignupNameErr").innerText = "Name must be at least 2 characters";
        valid = false;
    } else document.getElementById("SignupNameErr").innerText = "";

    if (!email.includes("@")) {
        document.getElementById("SignupEmailErr").innerText ="Invalid Email Format";
        valid = false;
    } else document.getElementById("SignupEmailErr").innerText = "";

    if (!phone || phone.length < 10) {
        document.getElementById("SignupPhoneErr").innerText = "Please enter a valid phone number";
        valid = false;
    } else document.getElementById("SignupPhoneErr").innerText = "";

    if (password.length < 6) {
        document.getElementById("SignupPasswordErr").innerText = "Minimum 6 Characters";
        valid = false;
    } else document.getElementById("SignupPasswordErr").innerText = "";

    const validRoles = ['admin', 'guide', 'visitor'];
    if (!validRoles.includes(role)) {
        document.getElementById("SignupRoleErr").innerText = "Please select a valid role";
        valid = false;
    } else document.getElementById("SignupRoleErr").innerText = "";

    if (!valid) return;

    try{
        const res = await fetch("http://localhost:4423/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ name, email, phone, password, role})
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            window.location.href = "login.html";
        } else {
            alert(data.message || "Signup Failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could Not connect to server. Try again later.");
    }
});
