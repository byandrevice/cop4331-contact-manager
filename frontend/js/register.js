// Wait for DOM to load, attach form submit handler
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        doSignup();
      });
    }
});
  

function validSignUpForm(firstName, lastName, username, password) {
    // Check if any fields are completely empty
    if (firstName.trim() === "" || lastName.trim() === "" || username.trim() === "" || password.trim() === "") {
        return false; 
    }
    // Check if the password is long enough (e.g., at least 8 characters)
    if (password.length < 8) {
        return false; 
    }
    // Check if it contains at least one number or  at least one letter
    const hasNumber = [...password].some(char => char >= '0' && char <= '9');
    const hasLetter = [...password].some(char => (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'));
    // If it fails either check, it's a bad password
    if (!hasNumber || !hasLetter) {
        return false;
    }

    return true;
}

async function doSignup() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const resultMsg = document.getElementById("signupResult");  // find and grab reference to a specific element on web page
    
    // Clear previous messages and hide box
    resultMsg.innerHTML = "";
    resultMsg.style.display = "none";

    // Validate the form fields
    if (!validSignUpForm(firstName, lastName, username, password)) {
        if (firstName.trim() === "" || lastName.trim() === "" || username.trim() === "" || password.trim() === "") {
            document.getElementById("signupResult").innerHTML = "Please fill out all fields.";
        } 
        // If fields are full check password
        else {
            document.getElementById("signupResult").innerHTML = "Password must be at least 8 characters long and contain both letters and numbers.";
        }
        // Show the error box and stop the registration
        document.getElementById("signupResult").style.display = "block";
        return;
    }

    let payload = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: password
    };

    let jsonPayload = JSON.stringify(payload);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/register.php", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // This function runs when the server responds
    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) return;  // not done yet

        if (this.status === 200) {
        // Success: parse the JSON response
        const jsonObject = JSON.parse(this.responseText);
        // Assuming server returns { id: 123, firstName: "John", lastName: "Doe" }
        if (jsonObject.id > 0) {
            // Save user info to localStorage (not cookies)
            localStorage.setItem('userId', jsonObject.id);
            localStorage.setItem('username', username);
            localStorage.setItem('firstName', jsonObject.firstName || firstName);
            localStorage.setItem('lastName', jsonObject.lastName || lastName);
            // Redirect to contacts page
            resultMsg.className = "success-box"; 
            resultMsg.innerHTML = "☦ Registration Successful! Welcome to the Circle... ☦";
            resultMsg.style.display = "block";

            // Disable the submit button so user dont spam click it
            const submitBtn = document.getElementById("reg_submit");
            if (submitBtn) submitBtn.disabled = true;

            // 4. Wait a seconda then redirect
            setTimeout(() => {
                window.location.href = "contacts.html";
            }, 1000);
        } else {
            // Server returned id = 0 or error /
            resultMsg.className = "error-box";
            resultMsg.innerHTML = jsonObject.error || "Registration failed.";
            resultMsg.style.display = "block";
        }
        } 
        else if (this.status === 409) {
        // Conflict: user already exists
        resultMsg.innerHTML = "User already exists.";
        resultMsg.style.display = "block";
        }
        else {
        // Any other HTTP error
        resultMsg.innerHTML = "Server error (status " + this.status + "). Please try again.";
        resultMsg.style.display = "block";
        }
    };

    // Send the request
    xhr.send(jsonPayload);
}

function togglePassword() {
    const toggle   = document.getElementById( "togglePassword" );
    const password = document.getElementById( "password" );

    if( !toggle || !password ) return;

    const type = password.getAttribute( "type" ) === "password" ? "text" : "password";
    password.setAttribute( "type", type );
    toggle.innerHTML = type === "password" ? "𖤓" : "⚛";
}

// Real-time password complexity rule validator
function checkPassword(passwordValue) {
    const ruleLength = document.getElementById("rule-length");
    const ruleLetter = document.getElementById("rule-letter");
    const ruleNumber = document.getElementById("rule-number");

    if (!ruleLength || !ruleLetter || !ruleNumber) return;

    // 2. Rule Check A: At least 8 characters long
    if (passwordValue.length >= 8) {
        ruleLength.classList.add("valid");
    } else {
        ruleLength.classList.remove("valid");
    }

    // 3. Rule Check B: Contains at least one letter
    const hasLetter = [...passwordValue].some(char => (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'));
    if (hasLetter) {
        ruleLetter.classList.add("valid");
    } else {
        ruleLetter.classList.remove("valid");
    }

    // 4. Rule Check C: Contains at least one number
    const hasNumber = [...passwordValue].some(char => char >= '0' && char <= '9');
    if (hasNumber) {
        ruleNumber.classList.add("valid");
    } else {
        ruleNumber.classList.remove("valid");
    }
}