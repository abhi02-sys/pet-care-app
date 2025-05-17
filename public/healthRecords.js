document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('health-record-form');
    const recordsList = document.getElementById('records-list');
    const filterType = document.getElementById('filter-type');
    const searchInput = document.getElementById('search-records');

    const petId = localStorage.getItem('selectedPetId');

    if (!petId) {
        alert('Pet not selected. Please go back and select a pet.');
        return;
    }

    loadRecords();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const record = {
            petId: petId,
            type: document.getElementById('record-type').value,
            name: document.getElementById('record-name').value.trim(),
            notes: document.getElementById('record-notes').value.trim(),
            date: document.getElementById('record-date').value,
            vet_clinic: document.getElementById('record-vet').value.trim()
        };

        if (!record.type || !record.name || !record.date) {
            alert('Please fill in required fields.');
            return;
        }

        try {
            const res = await fetch('/api/health-records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            });

            const data = await res.json();
            if (data.success) {
                form.reset();
                loadRecords();
            } else {
                alert('Failed to add health record.');
            }
        } catch (err) {
            console.error('Error adding record:', err);
        }
    });

    async function loadRecords() {
        try {
            const res = await fetch(`/api/health-records/${petId}`);
            const data = await res.json();

            if (data.success) {
                renderRecords(data.records);
            } else {
                recordsList.innerHTML = '<p class="no-records">Failed to load records</p>';
            }
        } catch (err) {
            console.error('Error loading records:', err);
        }
    }

    function renderRecords(records) {
        const filter = filterType.value;
        const query = searchInput.value.toLowerCase();

        const filtered = records.filter(record =>
            (filter === 'all' || record.type === filter) &&
            (record.name?.toLowerCase().includes(query) || record.notes?.toLowerCase().includes(query))
        );

        recordsList.innerHTML = '';

        if (filtered.length === 0) {
            recordsList.innerHTML = '<p class="no-records">No matching records</p>';
            return;
        }

        filtered.forEach(record => {
            const recordDiv = document.createElement('div');
            recordDiv.className = 'record-card';

            recordDiv.innerHTML = `
                <h3>${record.name} (${record.type})</h3>
                <p><strong>Date:</strong> ${new Date(record.date).toLocaleDateString()}</p>
                ${record.vet_clinic ? `<p><strong>Vet/Clinic:</strong> ${record.vet_clinic}</p>` : ''}
                ${record.notes ? `<p><strong>Notes:</strong> ${record.notes}</p>` : ''}
                <button class="delete-btn" data-id="${record.record_id}">Delete</button>
            `;

            recordsList.appendChild(recordDiv);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (confirm('Are you sure you want to delete this record?')) {
                    deleteRecord(id);
                }
            });
        });
    }

    async function deleteRecord(id) {
        try {
            const res = await fetch(`/api/health-records/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.success) {
                loadRecords();
            } else {
                alert('Failed to delete record.');
            }
        } catch (err) {
            console.error('Error deleting record:', err);
        }
    }

    filterType.addEventListener('change', loadRecords);
    searchInput.addEventListener('input', loadRecords);
});
