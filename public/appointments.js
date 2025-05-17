document.addEventListener("DOMContentLoaded", function () {
    console.log("Appointments script loaded"); // Debugging line
    
    // DOM elements
    const typeSelect = document.getElementById('appointment-type');
    const detailsInput = document.getElementById('appointment-details');
    const dateInput = document.getElementById('appointment-date');
    const addBtn = document.getElementById('add-appointment-btn');
    const appointmentsList = document.getElementById('appointments-list');
    
    // Debugging: Check if elements exist
    if (!typeSelect || !detailsInput || !dateInput || !addBtn || !appointmentsList) {
        console.error("One or more elements not found!");
        return;
    }
    
    // Load appointments when page loads
    loadAppointments();
    
    // Add new appointment
    addBtn.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent form submission if in a form
        addAppointment();
    });
    
    // Function to add appointment
    async function addAppointment() {
        const type = typeSelect.value;
        const details = detailsInput.value.trim();
        const dateTime = dateInput.value;
    
        console.log("Adding appointment:", { type, details, dateTime }); // Debugging
    
        if (!type || !details || !dateTime) {
            alert('Please fill out all fields');
            return;
        }
    
        // 🔸 Get petId from localStorage
        const petId = localStorage.getItem('selectedPetId');
        if (!petId) {
            alert('No pet selected. Please select a pet first.');
            return;
        }
    
        const appointment = {
            petId: parseInt(petId),
            type,
            details,
            datetime: dateTime,
        };
    
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointment),
            });
    
            const data = await response.json();
            if (data.success) {
                loadAppointments();
                clearInputs();
            } else {
                alert('Error adding appointment');
            }
        } catch (err) {
            console.error('Error adding appointment:', err);
        }
    }
    
    // Load appointments from the backend
    async function loadAppointments() {
        const petId = localStorage.getItem('selectedPetId');
        if (!petId) {
            appointmentsList.innerHTML = '<li class="no-appointments">No pet selected</li>';
            return;
        }
    
        try {
            const res = await fetch(`/api/appointments/${petId}`);
            const data = await res.json();
            if (data.success) {
                renderAppointments(data.appointments);
            } else {
                appointmentsList.innerHTML = '<li class="no-appointments">Failed to load appointments</li>';
            }
        } catch (err) {
            console.error('Error loading appointments:', err);
        }
    }
    

    // Render appointments to the DOM
    function renderAppointments(appointments) {
        appointments.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
        
        appointmentsList.innerHTML = '';
        
        if (appointments.length === 0) {
            appointmentsList.innerHTML = '<li class="no-appointments">No upcoming appointments</li>';
            return;
        }
        
        appointments.forEach(appointment => {
            const li = document.createElement('li');
            li.dataset.id = appointment.appointment_id;
            
            const date = new Date(appointment.datetime);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
            
            li.innerHTML = `
                <div class="appointment-info">
                    <span class="appointment-type ${appointment.type.toLowerCase().replace(' ', '-')}">${appointment.type}</span>
                    <span class="appointment-details">${appointment.details}</span>
                    <span class="appointment-date">${formattedDate}</span>
                </div>
                <button class="delete-btn" data-id="${appointment.appointment_id}">×</button>
            `;
            
            appointmentsList.appendChild(li);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                deleteAppointment(parseInt(this.dataset.id));
            });
        });
    }

    // Delete appointment from the backend
    async function deleteAppointment(id) {
        try {
            const res = await fetch(`/api/appointments/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                loadAppointments(); // Reload appointments
            } else {
                alert('Error deleting appointment');
            }
        } catch (err) {
            console.error('Error deleting appointment:', err);
        }
    }

    // Clear the input fields
    function clearInputs() {
        typeSelect.value = '';
        detailsInput.value = '';
        dateInput.value = '';
    }
});
