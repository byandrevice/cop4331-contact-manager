// Hook up the form submission
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Stop page reload
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

    let jsonPayload = JSON.stringify(tmp);
    let url = apiBase + '/SignUp.' + apiExt;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {
                resultMsg.innerHTML = "User already exists";
                resultMsg.style.display = "block";
                return;
            }

            if (this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                
                // Save global or local context before baking cookie
                let userId = jsonObject.id;
                let fName = jsonObject.firstName || firstName;
                let lName = jsonObject.lastName || lastName;
                
                saveCookie(fName, lName, userId);
                
                // Redirect to a dashboard or homepage after successful signup
                window.location.href = "contacts.html"; 
            } else {
                resultMsg.innerHTML = "Error: Status " + this.status;
                resultMsg.style.display = "block";
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        resultMsg.innerHTML = err.message;
        resultMsg.style.display = "block";
    }
}

function saveCookie(firstName, lastName, userId) {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = `firstName=${firstName},lastName=${lastName},userId=${userId};expires=${date.toGMTString()};path=/`;
}