/* Copy from prof github, not yet update */

// already exit username
async function exitUser() {}

async function doSignup() {
    let userId = 0;
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    const ids = []

    // Invald signup form
    if (!validSignUpForm(firstName, lastName, username, password)) {
        document.getElementById("signupResult").innerHTML = "invalid signup";
        return;
    }

    var hash = md5(password);

    document.getElementById("signupResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SignUp.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {

            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {
                document.getElementById("signupResult").innerHTML = "User already exists";
                return;
            }

            if (this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("signupResult").innerHTML = "User added";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}
nameCheck() {

    //Set up for 
    let fNameField = document.getElementById("firstName");
    let lNameField = document.getElementById("lastName");
    let userform = document.getElementById("username");
    let totalform = document.getElementById("wholeForm");
    let numInput = document.getElementById("userNum");
    let lettInput = document.getElementById("userLett");
    let lenInput = document.getElementById("userLen");
    let hypInput = document.getElementById("userHyp");
    let undInput = document.getElementById("userUnd");

    // to activate transitions
    fNameField.onclick = function () {
        totalform.style.minHeight = "360.001px";
      }

      lNameField.onclick = function () {
        totalform.style.minHeight = "360.001px";
      }
  
      //password message displays
      userform.onfocus = function () {
        document.getElementById("explanationUser").style.display = "block";
        totalform.style.minHeight = "675px";
      }

      //password message goes away
      userform.onblur = function () {
        document.getElementById("explanationUser").style.display = "none";
        totalform.style.minHeight = "360px";
      }

      //password validation
      userform.onkeyup = function () {
        var nums = /[0-9]/g;
        var lett = /[a-zA-Z]/g;
        var hyp = /[-]/g;
        var und = /[_]/g;

        //check length
        if ((userform.value.length >= 3 && userform.value.length <= 18)) {
          lenInput.classList.remove("invalid");
          lenInput.classList.add("valid");

        }

        else {
          lenInput.classList.remove("valid");
          lenInput.classList.add("invalid");

        }

        //check letters
        if ((userform.value.match(lett))) {

          lettInput.classList.remove("invalid");
          lettInput.classList.add("valid");
        }

        else {

          lettInput.classList.remove("valid");
          lettInput.classList.add("invalid");
        }

        //check numbers
        if (userform.value.match(nums)) {
          numInput.classList.remove("opt");
          numInput.classList.add("valid");
        }

        else {
          numInput.classList.remove("valid");
          numInput.classList.add("opt");
        }

        //check hyphens
        if (userform.value.match(hyp)) {
          hypInput.classList.remove("opt");
          hypInput.classList.add("valid");
        }

        else {
          hypInput.classList.remove("valid");
          hypInput.classList.add("opt");
        }

        // check underscores
        if (userform.value.match(und)) {
          undInput.classList.remove("opt");
          undInput.classList.add("valid");
        }

        else {
          undInput.classList.remove("valid");
          undInput.classList.add("opt");
        }
      }
}

passCheck () {
    let passform = document.getElementById("password");
    let pNumInput = document.getElementById("passNum");
    let pLettInput = document.getElementById("passLett");
    let pSpecInput = document.getElementById("passSpec");
    let pLenInput = document.getElementById("passLen");

    //password message displays
    passform.onfocus = function () {
      document.getElementById("explanation").style.display = "block";
      totalform.style.minHeight = "570px";
    };

    //password message goes away
    passform.onblur = function () {
      document.getElementById("explanation").style.display = "none";
      totalform.style.minHeight = "360px";
    }

    //password validation
    passform.onkeyup = function () {
      var nums = /[0-9]/g;
      var lett = /[a-zA-Z]/g;
      var spec = /[!@#$%^&*]/g;

      //check length
      if (passform.value.length >= 8 && passform.value.length <= 32) {
        pLenInput.classList.remove("invalid");
        pLenInput.classList.add("valid");
      }

      else {
        pLenInput.classList.remove("valid");
        pLenInput.classList.add("invalid");
      }

      //check numbers
      if (passform.value.match(nums)) {
        pNumInput.classList.remove("invalid");
        pNumInput.classList.add("valid");
      }

      else {
        pNumInput.classList.remove("valid");
        pNumInput.classList.add("invalid");
      }

      //check letters
      if (passform.value.match(lett)) {
        pLettInput.classList.remove("invalid");
        pLettInput.classList.add("valid");
      }

      else {
        pLettInput.classList.remove("valid");
        pLettInput.classList.add("invalid");
      }

      //check special characters
      if (passform.value.match(spec)) {
        pSpecInput.classList.remove("invalid");
        pSpecInput.classList.add("valid");
      }

      else {
        pSpecInput.classList.remove("valid");
        pSpecInput.classList.add("invalid");
      }
    }
}