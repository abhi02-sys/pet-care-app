const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all health records for a pet
router.get('/:petId', async (req, res) => {
    try {
        const { petId } = req.params;
        const [records] = await db.query("SELECT * FROM health_records WHERE petId = ? ORDER BY date DESC", [petId]);
        res.json({ success: true, records });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching records" });
    }
});

// Add a new health record
router.post('/', async (req, res) => {
    try {
        const { petId, type, name, notes, date, vet_clinic } = req.body;
        const [result] = await db.query(
            "INSERT INTO health_records (petId, type, name, notes, date, vet_clinic) VALUES (?, ?, ?, ?, ?, ?)",
            [petId, type, name, notes, date, vet_clinic]
        );
        res.json({ success: true, recordId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding record" });
    }
});

// Delete a health record
router.delete('/:recordId', async (req, res) => {
    try {
        const { recordId } = req.params;
        await db.query("DELETE FROM health_records WHERE record_id = ?", [recordId]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error deleting record" });
    }
});

module.exports = router;
