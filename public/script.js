
// ================== LOGIN/SIGNUP/FORGOT PASSWORD ==================

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordSection').style.display = 'none';
    document.getElementById('loginBtn').classList.add('active');
    document.getElementById('signupBtn').classList.remove('active');
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('forgotPasswordSection').style.display = 'none';
    document.getElementById('signupBtn').classList.add('active');
    document.getElementById('loginBtn').classList.remove('active');
}



async function login(event) {
    event.preventDefault();
    console.log("Login triggered");

    const email = document.querySelector('#email')?.value.trim();
    const password = document.querySelector('#password')?.value.trim();

    if (!email || !password) {
        alert('Please fill in both email and password.');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.token && data.user) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                role: data.user.role
        }));
            window.location.href = '/role.html'; 
        } else {
            alert(data.message || 'Login failed.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
    }
}

async function signup(event) {
    event.preventDefault();

    const username = document.getElementById('signupUsername')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value.trim();

    if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role: 'user' })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Signup successful! You can now log in.');
            window.location.href = '/';
        } else {
            alert(data.message || 'Signup failed.');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup.');
    }
}

// ================== EVENT LISTENERS ==================

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');

    if (loginForm) loginForm.addEventListener("submit", login);
    if (signupForm) signupForm.addEventListener("submit", signup);

    // if (localStorage.getItem('token')) {
    //     window.location.href = '/role.html'; // Already logged in, redirect to role page
    //     return; // Stop running rest of this script
    // }

    if (loginBtn && signupBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSignup();
        });
    }

    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLogin = document.getElementById('backToLogin');
    const sendResetLinkBtn = document.getElementById('sendResetLinkBtn');

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').style.display = "none";
            document.getElementById('forgotPasswordSection').style.display = "block";
        });
    }

    if (backToLogin) {
        backToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('forgotPasswordSection').style.display = "none";
            document.getElementById('loginForm').style.display = "block";
        });
    }

    if (sendResetLinkBtn) {
        sendResetLinkBtn.addEventListener('click', () => {
            const email = document.getElementById('resetEmail').value.trim();
            if (email) {
                alert("Password reset link sent to: " + email);
                document.getElementById('forgotPasswordSection').style.display = "none";
                document.getElementById('loginForm').style.display = "block";
            } else {
                alert("Please enter your email.");
            }
        });
    }

    // ================== ROLE SELECTION ==================

    const ownerBtn = document.getElementById('ownerBtn');
    const caregiverBtn = document.getElementById('caregiverBtn');

   
    if (ownerBtn) {
        ownerBtn.addEventListener('click', async function () {
          
            const userId = localStorage.getItem('userId');
            console.log(`${userId} clicked petowner`);
    
            if (!userId) {
                alert('User not logged in.');
                return;
            }
    
            try {
                console.log('userId before fetch:', userId);

                // First: Send only userId, without groupCode
                const response = await fetch('/api/checkOrCreateGroup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                console.log(response.status);
                const data = await response.json();
                console.log(data);

                if (data.success) {
                    const groupCode = data.groupCode;
    
                    document.getElementById('groupCode').textContent = groupCode;
                    document.getElementById('code-container').style.display = 'block';
                    localStorage.setItem('groupCode', groupCode);
    
                    alert('Group code fetched or created successfully!');
                   // window.location.href = 'pet-profile.html';
                } else {
                    alert('Server error: ' + data.message);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('Error contacting server.');
            }
        });
    }
    
    if (caregiverBtn) {
        caregiverBtn.addEventListener('click', function () {
  const enteredCode = prompt("Please enter the pet owner's group code:");

  if (!enteredCode) return;

  fetch('/api/joinGroup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ enteredCode, userId: localStorage.getItem('userId') })
})
.then(async response => {
  const text = await response.text();
  console.log("Raw response:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    alert("Server returned invalid JSON:\n" + text);
    return;
  }

  if (data.success) {
    alert('You have successfully joined the group!');
    window.location.href = "allPets.html";
  } else {
    alert('Error: ' + data.message);
  }
})
.catch(err => {
  console.error("Fetch error:", err);
  alert('Fetch failed: ' + err.message);
});

});

    }

    // ================== PET PROFILE MANAGEMENT ==================


const groupCode = localStorage.getItem("groupCode");
const userId = localStorage.getItem("userId");
const petDisplayContainer = document.getElementById("petProfiles"); // not petProfilesList

if (window.location.pathname === "/pet-profile.html") {
    if (groupCode && userId) {
        loadPets();
    } else {
        alert("Please log in to view pets.");
    }
}

const addPetCard = document.getElementById("addPetCard");
const addPetModal = document.getElementById("addPetModal");
const managePetModal = document.getElementById("managePetModal");
const closeBtns = document.querySelectorAll(".closeBtn");
const savePetBtn = document.getElementById("savePetBtn");
const manageProfilesBtn = document.getElementById("manageProfilesBtn");
const petProfilesList = document.getElementById("petProfilesList");

// Open modal to add pet
addPetCard?.addEventListener("click", () => {
    addPetModal.style.display = "flex";
});

// Close modals
closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        addPetModal.style.display = "none";
        managePetModal.style.display = "none";
    });
});

// Save new pet
savePetBtn?.addEventListener("click", () => {
    const petNameInput = document.getElementById("petNameInput").value.trim();
    const select = document.getElementById("petTypeSelect");
    const petType = select.value;
    const petEmoji = select.options[select.selectedIndex]?.textContent.trim().split(" ")[0];

    if (!petNameInput || !petType) {
        alert("Please enter all fields.");
        return;
    }

    savePet(petNameInput, petEmoji, petType);
    addPetModal.style.display = "none";
    document.getElementById("petNameInput").value = "";
    document.getElementById("petTypeSelect").value = "";
});


manageProfilesBtn?.addEventListener("click", async () => {
    petProfilesList.innerHTML = "";  // Clear the petProfilesList container before adding new content

    if (!userId) return alert("User not found");

    try {
        // Fetch pets associated with the user
        const response = await fetch(`/api/pets/user?userId=${userId}`);
        const data = await response.json();

        if (data.success && data.pets.length > 0) {
            // Render pet profiles in the UI
            data.pets.forEach((pet) => {
                const petItem = document.createElement("div");
                petItem.classList.add("manage-pet-item");
                petItem.setAttribute("data-id", pet.id); // Ensure each pet has a unique data-id
                petItem.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="font-size: 30px;">${pet.emoji}</div>
                        <div>${pet.name} (${pet.type})</div>
                    </div>
                    <button class="delete-btn" data-id="${pet.id}">Delete</button>
                `;
                petProfilesList.appendChild(petItem);
            });

            managePetModal.style.display = "flex"; // Show the modal

            // Attach the delete button event listeners
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", async function () {
                    const petId = this.getAttribute("data-id");
                    await deletePetFromBackend(petId); // Delete the pet
                    petItem.remove(); // Immediately remove the deleted pet from the DOM
                });
            });
        } else {
            petProfilesList.innerHTML = "<p>No pets found.</p>";
        }
    } catch (err) {
        console.error("Error loading pets:", err);
        alert("Error loading pets");
    }
});


window.addEventListener("click", (e) => {
    if (e.target === addPetModal) addPetModal.style.display = "none";
    if (e.target === managePetModal) managePetModal.style.display = "none";
});

// Load pets for the group
// async function loadPets() {
//     if (!groupCode || !userId) return;

//     try {
//         const response = await fetch(`/api/pets?groupCode=${groupCode}`);
//         const data = await response.json();

//         if (data.success) {
//             localStorage.setItem("pets", JSON.stringify(data.pets));
//             renderPets(data.pets);
//         } else {
//             alert("Failed to load pet profiles");
//         }
//     } catch (err) {
//         console.error("Error loading pets:", err);
//         alert("An error occurred while loading pets");
//     }
// }


async function loadPets() {
    const addPetCard = document.getElementById("addPetCard"); // Store BEFORE clearing
    petDisplayContainer.innerHTML = ""; // Now safe to clear

    // Re-append the Add Pet card first
    petDisplayContainer.appendChild(addPetCard);

    try {
        const response = await fetch(`/api/pets/user?userId=${userId}`);
        const data = await response.json();

        if (data.success && data.pets.length > 0) {
            data.pets.forEach((pet) => {
                const petCard = document.createElement("div");
                petCard.classList.add("pet-card");
                petCard.innerHTML = `
                    <div style="font-size: 40px;">${pet.emoji}</div>
                    <div>${pet.name}</div>
                    <div style="font-size: 14px; color: gray;">${pet.type}</div>
                `;

                // Click to go to dashboard
                petCard.addEventListener("click", () => {
                    localStorage.setItem("selectedPet", JSON.stringify(pet));
                    localStorage.setItem("selectedPetId", pet.id);
                    window.location.href = "dashboard.html";
                });

                // Insert each pet *before* the add card so + stays at the end
                petDisplayContainer.insertBefore(petCard, addPetCard);
            });
        } else {
            const noPetsMsg = document.createElement("p");
            noPetsMsg.textContent = "No pets found.";
            petDisplayContainer.insertBefore(noPetsMsg, addPetCard);
        }
    } catch (err) {
        console.error("Error loading pets:", err);
        alert("Failed to load pets");
    }
}


// Save pet to backend
async function savePet(name, emoji, type) {
    if (!userId) return alert("User not found");

    try {
        const response = await fetch("/api/pets/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, emoji, userId, type }),
        });

        const data = await response.json();
        if (data.success) {
            loadPets(); // refresh pets
        } else {
            alert("Failed to save pet: " + (data.message || "Unknown error"));
        }
    } catch (err) {
        console.error("Error saving pet:", err);
        alert("Error saving pet");
    }
}

// Delete pet from backend
// async function deletePetFromBackend(petId) {
//     try {
//         const response = await fetch(`/api/pets/${petId}`, { method: "DELETE" });
//         const data = await response.json();

//         if (data.success) {
//             alert("Pet deleted successfully");
            
//             manageProfilesBtn.click(); // reload pets
//         } else {
//             alert("Failed to delete pet");
//         }
//     } catch (err) {
//         console.error("Error deleting pet:", err);
//         alert("Error deleting pet");
//     }
// }

// Delete pet from backend (synchronous function)
async function deletePetFromBackend(petId) {
    try {
        const response = await fetch(`/api/pets/${petId}`, { method: "DELETE" });
        const data = await response.json();

        if (data.success) {
            alert("Pet deleted successfully");

            // Reload pets after deletion
            manageProfilesBtn.click(); // reload pets by calling manageProfilesBtn click
        } else {
            alert("Failed to delete pet");
        }
    } catch (err) {
        console.error("Error deleting pet:", err);
        alert("Error deleting pet");
    }
}


// Render pet cards
function renderPets(pets) {
    // Remove all existing pets except the Add Pet card
    const addPetCard = document.getElementById("addPetCard");
    petDisplayContainer.innerHTML = ""; // Clear all
    petDisplayContainer.appendChild(addPetCard); // Add back the "Add Pet" card

    if (!pets || pets.length === 0) {
        const noPetsMsg = document.createElement("p");
        noPetsMsg.textContent = "No pets found.";
        petDisplayContainer.insertBefore(noPetsMsg, addPetCard);
        return;
    }

    pets.forEach((pet) => {
        const petItem = document.createElement("div");
        petItem.classList.add("pet-item");
        petItem.innerHTML = `
            <div class="pet-info">
                <div class="pet-emoji" style="font-size: 30px;">${pet.emoji}</div>
                <div class="pet-name">${pet.name}</div>
                <div class="pet-type">${pet.type}</div>
            </div>
        `;
        petDisplayContainer.insertBefore(petItem, addPetCard);
    });
}


// Copy group code
window.copyCode = function () {
    const codeText = document.getElementById("groupCode").textContent;
    navigator.clipboard.writeText(codeText)
        .then(() => {
            alert("Code copied to clipboard!");
            window.location.href = "pet-profile.html";
        })
        .catch(err => alert("Failed to copy code: " + err));
};
});