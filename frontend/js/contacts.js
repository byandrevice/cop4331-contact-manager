// ============================================================
// GLOBAL STATE, AUTHENTICATION & LOGOUT & LOAD USER INFO
// ============================================================
let userId = localStorage.getItem('userId') || window.userId || 1;

function doLogout(event) {
    if (event) event.preventDefault();
    localStorage.clear();
    window.location.href = "login.html";
}
 
function displayUserInfo() {
    const firstName = localStorage.getItem('firstName');
    const lastName  = localStorage.getItem('lastName');
    const userSpan  = document.getElementById('userName');
    if (userSpan && firstName && lastName) {
        userSpan.textContent = `${firstName} ${lastName}`;
    }
}

// Toggle between night mode and day mode when logo is clicked
// Toggle between night mode and day mode when logo is clicked
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");

    // Apply saved theme immediately when the page loads
    if (localStorage.getItem("theme") === "day") {
        document.body.classList.add("day-mode");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            // Change theme instantly
            document.body.classList.toggle("day-mode");

            // Save the selected theme
            if (document.body.classList.contains("day-mode")) {
                localStorage.setItem("theme", "day");
            } else {
                localStorage.setItem("theme", "night");
            }
        });
    }
});
// Check authentication on page load and run initial pull
document.addEventListener("DOMContentLoaded", () => {
  displayUserInfo();
  const currentId = localStorage.getItem('userId');

  if (!currentId || currentId === "0") {
      window.location.href = "login.html";
      return;
  }
  
  // Automatically load contacts on startup
  loadContacts();
}); 

// ============================================================
// CORE FUNCTIONS: ADD CONTACT
// ============================================================
function addContact() {
  const firstname = document.getElementById("first_name").value;
  const lastname = document.getElementById("last_name").value;
  const phonenumber = document.getElementById("phone").value;
  const emailaddress = document.getElementById("email").value;

  // Run validation and capture the result
  const validationResult = validAddContact(firstname, lastname, phonenumber, emailaddress);

  if (validationResult !== true) {
      if (typeof showAlert === "function") {
          showAlert(validationResult, "error", "close-outline");
      }
      return;
  }

  // SAFE GUARD: Use the global userId, fallback to 1 if it doesn't exist yet
  const currentUserId = (typeof userId !== 'undefined') ? userId : 1;

  const tmp = {
      firstName: firstname,
      lastName: lastname,
      phoneNumber: phonenumber,
      emailAddress: emailaddress,
      userId: currentUserId
  };
  const jsonPayload = JSON.stringify(tmp);

  // let url = "https://reqres.in/api/users";    Testing Mock URL
  let url = "/api/user/addContacts.php";
  const xhr = new XMLHttpRequest();
  
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
  xhr.withCredentials = true; 

  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { 
          // ReqRes returns 201 for a successful POST creation
          if (xhr.status === 200 || xhr.status === 201) {
              console.log("Contact has been added successfully to your database.");
              
              // Reset the input fields
              document.getElementById("first_name").closest("form").reset();
              
              // 3. Automatically refresh the table dynamically
              loadContacts();
              
              if (typeof showTable === "function") showTable();
              if (typeof showAlert === "function") showAlert("Contact added successfully", "success", "checkmark-outline");
          } 
          else {
              let errorMessage = "Contact addition failed (Status: " + xhr.status + ")";
              try {
                  const data = JSON.parse(xhr.responseText);
                  errorMessage = data.error || errorMessage;
              } catch (e) {}
              if (typeof showAlert === "function") showAlert(errorMessage, "error", "close-outline");
          }
      }
  };

  try {
      xhr.send(jsonPayload);
  } catch (err) {
      console.error("Network dispatch error:", err.message);
      if (typeof showAlert === "function") showAlert("Network Error", "error", "close-outline");
  }
}


/**
 * Validates the contact form inputs before submitting to the server.
 * @returns {true|string} Returns true if valid, or an error message string if invalid.
 */
function validAddContact(first, last, phone, email) {
  const cleanFirst = first ? first.trim() : "";
  const cleanLast = last ? last.trim() : "";
  const cleanPhone = phone ? phone.trim() : "";
  const cleanEmail = email ? email.trim() : "";

  // 1. Check Required Fields
  if (cleanFirst === "" || cleanLast === "") {
      return "First name and Last name are required.";
  }

  // 2. Check Email Format
  if (cleanEmail !== "") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleanEmail)) {
          return "Invalid email format.";
      }
  }

  // 3. Check Phone Number Format (Enforces a standard 10-digit baseline)
  if (cleanPhone !== "") {
    // Strips away everything except numbers to count the raw digits
    const digitsOnly = cleanPhone.replace(/\D/g, "");
    
    if (digitsOnly.length !== 10) {
        return "Invalid phone number. Must contain exactly 10 digits.";
    }
    
    // This automatically reformats whatever they typed into: 123-456-7890
    document.getElementById("phone").value = `${digitsOnly.slice(0,3)}-${digitsOnly.slice(3,6)}-${digitsOnly.slice(6,10)}`;
  }
  // Everything is perfect
  return true;
}

// ============================================================
// CORE FUNCTIONS: LOAD & SEARCH CONCTACTS
// ============================================================
function loadContacts() {
  const search = document.getElementById("search").value;
  const xhr = new XMLHttpRequest();
  const url = `/api/user/searchContacts.php?q=` + encodeURIComponent(search);
  
  xhr.open("GET", url, true);
  xhr.withCredentials = true;
  
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 401 || xhr.status < 200 || xhr.status >= 300) {
              if (typeof showAlert === "function") showAlert("Server Error", "error", "close-outline");
              return;
          }
          
          try {
              const contacts = JSON.parse(xhr.responseText);
              renderContactsTable(contacts); 
          } catch (error) {
              console.error("Failed to parse response JSON:", error);
          }
      }
  };
  
  xhr.send();
}

function renderContactsTable(contacts) {
  const tableBody = document.getElementById("contacts");
  if (!tableBody) return;
  
  tableBody.innerHTML = ""; 
  
  if (!contacts || contacts.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No contacts found.</td></tr>`;
      return;
  }

  contacts.forEach(contact => {
      const row = document.createElement("tr");
      
      // Dynamic keys map to both Mock responses and final PHP schema seamlessly
      const name = contact.name || `${contact.firstName || contact.first_name || ''} ${contact.lastName || contact.last_name || ''}`.trim();
      const email = contact.email || contact.emailAddress || '';
      const phone = contact.phone || contact.phoneNumber || '';
      const contactId = contact.id || '';
      
      row.innerHTML = `
          <td>${escapeHTML(name)}</td>
          <td>${escapeHTML(email)}</td>
          <td>${escapeHTML(phone)}</td>
          <td>
              <button class="edit" onclick="editContact('${contactId}')">Edit</button>
              <button class="delete" onclick="deleteContact('${contactId}')">Delete</button>
          </td>
      `;
      
      tableBody.appendChild(row);
  });
}

// ============================================================
// UTILITY HELPERS
// ============================================================
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function showAlert(message, type, icon) {
    const template = document.getElementById("alert-template");
    if (!template) {
        alert(message);
        return;
    }
    const clone = template.content.cloneNode(true);
    clone.querySelector("span").textContent = message;
    clone.querySelector("ion-icon").setAttribute("name", icon);
    
    document.body.appendChild(clone);
    
    setTimeout(() => {
        const activeAlert = document.querySelector(".alert-box");
        if (activeAlert) activeAlert.remove();
    }, 3000);
}

// Placeholder wrappers for UI events
function editContact(id) { console.log("Editing row ID:", id); }
function deleteContact(id) { console.log("Deleting row ID:", id); }
function showTable() { console.log("Displaying table view UI"); }
