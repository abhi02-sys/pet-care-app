const express = require('express');
const router = express.Router();
const db = require('../config/db');  // your MySQL pool/connection

// Get all todos for a pet
router.get('/:petId', async (req, res) => {
    try {
        const { petId } = req.params;
        // Aliasing task_id to id for frontend use
        const [todos] = await db.query("SELECT task_id AS id, task FROM todos WHERE petId = ?", [petId]);
        res.json({ success: true, todos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching todos" });
    }
});

// Add new todo for a pet
router.post('/', async (req, res) => {
    try {
        const { petId, task } = req.body;
        const [result] = await db.query("INSERT INTO todos (petId, task) VALUES (?, ?)", [petId, task]);
        res.json({ success: true, todoId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding todo" });
    }
});

// // Toggle todo status
// router.put('/:todoId', async (req, res) => {
//     try {
//         const { todoId } = req.params;
//         const { isCompleted } = req.body;
//         await db.query("UPDATE todos SET isCompleted = ? WHERE task_id = ?", [isCompleted, todoId]);
//         res.json({ success: true });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Error updating todo" });
//     }
// });

// Delete todo
router.delete('/:todoId', async (req, res) => {
    try {
        const { todoId } = req.params;
        await db.query("DELETE FROM todos WHERE task_id = ?", [todoId]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error deleting todo" });
    }
});

module.exports = router;
