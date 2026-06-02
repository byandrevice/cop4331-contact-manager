// ============================================================
// GLOBAL STATE, AUTHENTICATION & LOGOUT & LOAD USER INFO
// ============================================================

let userId = localStorage.getItem('userId') || window.userId || 1; // Tracks the unique identifier of the logged-in user.

function doLogout(event) {
    if (event) event.preventDefault();
    
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    
    window.location.href = "index.html";
}
 
function displayUserInfo() {
    const firstName = localStorage.getItem('firstName');
    const lastName  = localStorage.getItem('lastName');
    const userSpan  = document.getElementById('userName');
    if (userSpan && firstName && lastName) {
        userSpan.textContent = `${firstName} ${lastName}`;
    }
}

// Theme toggle
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("themeToggle");

    // Remember last theme on page load
    if (localStorage.getItem("theme") === "day") {
        document.body.classList.add("day-mode");
        if (toggle) {
            toggle.src = "images/logo_day.png"; // Load day variant if set
        } else {
            if (toggle) {
                toggle.src = "images/logo_night.png"; // Default fallback
            }
        }
    }

    // Click logo to switch themes and swap image sources
    if (toggle) {
        toggle.addEventListener("click", function () {
            document.body.classList.toggle("day-mode");
            const isDayMode = document.documentElement.classList.contains("day-mode");
            
            // Save current choice to browser memory
            localStorage.setItem("theme", isDayMode ? "day" : "night");
            
            // Change the image instantly on the screen when clicked
            if (isDayMode) {
                toggle.src = "images/logo_day.png";
            } else {
                toggle.src = "images/logo_night.png";
            }
        });
    }
});

// Check authentication on page load and run initial pull
document.addEventListener("DOMContentLoaded", () => {
     displayUserInfo();
    const currentId = localStorage.getItem('userId');

    // If no active user session found, boot them back to the landing form
    if (!currentId || currentId === "0") {
        window.location.href = "index.html";
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

    // Block submission and flash alert bubble if requirements arent met
    if (validationResult !== true) {
        if (typeof showAlert === "function") {
            showAlert(validationResult, "error", "close-outline");
        }
        return;
    }

    // Gather tracking ID for session mapping
    const currentUserId = localStorage.getItem('userId') || userId || 1;

    const tmp = {
        firstName: firstname,
        lastName: lastname,
        phone: phonenumber,         // Changed from phoneNumber
        email: emailaddress,       // Changed from emailAddress
        userId: currentUserId
    };
    const jsonPayload = JSON.stringify(tmp);

    // let url = "https://reqres.in/api/users";    Testing Mock URL
    let url = "/api/addContact.php";
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
                
                // Automatically refresh the table dynamically
                loadContacts();
                
                if (typeof showTable === "function") showTable();
                if (typeof showAlert === "function") showAlert("Contact added successfully", "success", "checkmark-outline");
            } 
            else {
                // Extract error strings provided by the server if available
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
 */
function validAddContact(first, last, phone, email) {
    const cleanFirst = first ? first.trim() : "";
    const cleanLast = last ? last.trim() : "";
    const cleanPhone = phone ? phone.trim() : "";
    const cleanEmail = email ? email.trim() : "";

    // Check Required Fields
    if (cleanFirst === "" || cleanLast === "") {
        return "First name and Last name are required.";
    }

    // Check Email
    if (cleanEmail !== "") {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(cleanEmail)) {
            return "Invalid email format.";
        }
    }

    // Check Phone Number Format- 10-digit baseline
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

    const currentUserId = (typeof userId !== 'undefined') ? userId : 1;
    // Build the JSON payload PHP expects
    const payload = {
        userId: currentUserId,
        search: search
    }
    const xhr = new XMLHttpRequest();
    const url = "/api/searchContacts.php";
    
    // Open communication channels via HTTP POST method to route payload data bodies safely
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.withCredentials = true;
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status < 200 || xhr.status >= 300) {
                if (typeof showAlert === "function") showAlert("Server Error", "error", "close-outline");
                return;
            }
            
            try {
                const response = JSON.parse(xhr.responseText);
                // Break out the array results envelope key sent back from server layout
                if (response.success && response.results) {
                    renderContactsTable(response.results); 
                } else {
                    console.error("Backend error:", response.error);
                    renderContactsTable([]); // Render empty table if error occurs
                }
            } catch (error) {
                console.error("Failed to parse response JSON:", error);
            }
        }
    };
    
    xhr.send(JSON.stringify(payload));
  }

function renderContactsTable(contacts) {
    const tableBody = document.getElementById("contacts");
    if (!tableBody) return;
    
    // Clear old row structures
    tableBody.innerHTML = ""; 
    
    // Result collection is empty
    if (!contacts || contacts.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No contacts found.</td></tr>`;
        return;
    }

    // Anchor the database ID into a data-attribute for reference mapping
    contacts.forEach(contact => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", contact.id || '');
        
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
// EDIT CONTACT — inline row editing
// ============================================================
function editContact(id) {
    const existing = document.querySelector("tr.editing");
    if (existing) cancelEdit(existing);
 
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;
 
    row.classList.add("editing");

    // Snapshot current values straight from the cells
    const [nameTd, emailTd, phoneTd, actionsTd] = row.querySelectorAll("td");
    
    // Parse name string back into First and Last names
    const nameParts = nameTd.textContent.trim().split(" ");
    const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0];
    const lastName  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    const email     = emailTd.textContent.trim();
    const phone     = phoneTd.textContent.trim();

    // Swap static text cells with inline form input fields
    nameTd.innerHTML = `
        <input type="text" id="edit-first" value="${escapeHTML(firstName)}" style="width:48%; display:inline-block; margin-right:2%;">
        <input type="text" id="edit-last" value="${escapeHTML(lastName)}" style="width:48%; display:inline-block;">
    `;
    emailTd.innerHTML = `<input type="email" id="edit-email" value="${escapeHTML(email)}" style="width:100%;">`;
    phoneTd.innerHTML = `<input type="text" id="edit-phone" value="${escapeHTML(phone)}" style="width:100%;">`;
    // Swap Edit/Delete buttons out for Save/Cancel actions
    actionsTd.innerHTML = `
        <button class="save-btn" onclick="saveEdit('${id}')">Save</button>
        <button class="cancel-btn" onclick="loadContacts()">Cancel</button>
    `;
}
 
function cancelEdit(row) {
    if (!row) return;
    row.classList.remove("editing");
    loadContacts(); // Reload to restore original values
}
 
function saveEdit(id) {
    const row       = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    const firstName = row.querySelector("#edit-first")?.value.trim()  ?? "";
    const lastName  = row.querySelector("#edit-last")?.value.trim()   ?? "";
    const email     = row.querySelector("#edit-email")?.value.trim()  ?? "";
    const phone     = row.querySelector("#edit-phone")?.value.trim()  ?? "";
 
    if (!firstName || !lastName) {
        showAlert("First and last name are required.", "error", "close-outline");
        return;
    }
 
    // Secure the logged-in user id to fulfill validation requirement
    const currentUserId = localStorage.getItem('userId') || userId || 1;

    // Build complete backend payload matching updateContact.php parameters
    const payload = JSON.stringify({ 
        userId: parseInt(currentUserId),
        contactId: parseInt(id), 
        firstName: firstName, 
        lastName: lastName, 
        email: email, 
        phone: phone 
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/updateContact.php", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.withCredentials = true;
 
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
 
        if (xhr.status === 200 || xhr.status === 201) {
            showAlert("Contact updated.", "success", "checkmark-outline");
            loadContacts();
        } else {
            let msg = `Update failed (Status: ${xhr.status})`;
            try { msg = JSON.parse(xhr.responseText).error || msg; } catch (_) {}
            showAlert(msg, "error", "close-outline");
        }
    };
 
    xhr.send(payload);
}
 
 
// ============================================================
// DELETE CONTACT
// ============================================================
function deleteContact(id) {
    if (!confirm("Permanently remove this contact?")) return;
 
    // Secure the actual userId
    const currentUserId = localStorage.getItem('userId') || userId || 1;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/deleteContact.php", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.withCredentials = true;
 
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
 
        if (xhr.status === 200) {
            // Fade the row out before reloading for a smoother feel
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.style.transition = "opacity 0.3s ease";
                row.style.opacity = "0";
                setTimeout(loadContacts, 320); // Sync layout presentation once animation transitions finish
            } else {
                loadContacts();
            }
            showAlert("Contact deleted.", "success", "checkmark-outline");
        } else {
            let msg = `Delete failed (Status: ${xhr.status})`;
            try { msg = JSON.parse(xhr.responseText).error || msg; } catch (_) {}
            showAlert(msg, "error", "close-outline");
        }
    };
    // Construct request parameters utilizing numerical integer data formats required by backends
    xhr.send(JSON.stringify({ userId: parseInt(currentUserId), contactId: parseInt(id) }));
}
 
 
// ============================================================
// UTILITY HELPERS
// ============================================================

/**
 * Encodes special characters into HTML entities to safely mitigate Cross-Site Scripting (XSS) risks.
 * Ensures user-submitted content cannot arbitrarily execute code within table rows.
 */
function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
 
function showAlert(message, type, icon) {
    // Remove any existing alert first
    document.querySelector(".alert-box")?.remove();
 
    const template = document.getElementById("alert-template");
    if (!template) { alert(message); return; } // Backup if markup layouts lack templates
 
    const clone = template.content.cloneNode(true);
    clone.querySelector("span").textContent = message;
    clone.querySelector("ion-icon").setAttribute("name", icon);
 
    const box = clone.querySelector(".alert-box") || clone.firstElementChild;
    if (box) box.dataset.alertType = type;   // lets CSS colour success vs error if needed
 
    document.body.appendChild(clone);
 
    setTimeout(() => document.querySelector(".alert-box")?.remove(), 3000);
}
 
/**
 * Standard utility mapping ensuring targeting application layout container block elements 
 * display correctly once data records are loaded or added.
 */
function showTable() {
    const wrapper = document.querySelector(".table-wrapper");
    if (wrapper) wrapper.style.display = "block";
}