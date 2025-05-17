const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all appointments for a pet
router.get('/:petId', async (req, res) => {
    try {
        const { petId } = req.params;
        const [appointments] = await db.query("SELECT * FROM appointments WHERE petId = ? ORDER BY datetime ASC", [petId]);
        res.json({ success: true, appointments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching appointments" });
    }
});

// Add a new appointment
router.post('/', async (req, res) => {
    try {
        const { petId, type, details, datetime } = req.body;
        const [result] = await db.query(
            "INSERT INTO appointments (petId, type, details, datetime) VALUES (?, ?, ?, ?)",
            [petId, type, details, datetime]
        );
        res.json({ success: true, appointmentId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding appointment" });
    }
});

// Delete an appointment
router.delete('/:appointmentId', async (req, res) => {
    try {
        const { appointmentId } = req.params;
        await db.query("DELETE FROM appointments WHERE appointment_id = ?", [appointmentId]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error deleting appointment" });
    }
});

module.exports = router;
