// controllers/petController.js
const db = require('../config/db');

// exports.createPet = async (req, res) => {
//     const { name, emoji, userId } = req.body;

//     if (!name || !userId) {
//         return res.status(400).json({ success: false, message: 'Name and userId are required' });
//     }

//     try {
//         // Get groupCode associated with this user
//         const [groupRows] = await db.query(
//             'SELECT group_code FROM `groups` WHERE owner_id = ?',
//             [userId]
//         );

//         if (groupRows.length === 0) {
//             return res.status(404).json({ success: false, message: 'Group not found for this user' });
//         }

//         const groupCode = groupRows[0].group_code;

//         await db.query(
//             'INSERT INTO `pets` (name, emoji, group_code, owner_id) VALUES (?, ?, ?, ?)',
//             [name, emoji || '🐾', groupCode, userId]
//         );

//         res.status(201).json({ success: true, message: 'Pet profile created successfully' });

//     } catch (err) {
//         console.error('Error creating pet:', err);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };

exports.createPet = async (req, res) => {
    const { name, emoji, type, userId } = req.body;

    if (!name || !userId || !type) {
        return res.status(400).json({ success: false, message: 'Name, type, and userId are required' });
    }

    try {
        // Get groupCode associated with this user
        const [groupRows] = await db.query(
            'SELECT group_code FROM `groups` WHERE owner_id = ?',
            [userId]
        );

        if (groupRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Group not found for this user' });
        }

        const groupCode = groupRows[0].group_code;

        await db.query(
            'INSERT INTO `pets` (name, type, emoji, group_code, owner_id) VALUES (?, ?, ?, ?, ?)',
            [name, type, emoji || '🐾', groupCode, userId]
        );

        res.status(201).json({ success: true, message: 'Pet profile created successfully' });

    } catch (err) {
        console.error('Error creating pet:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getPetsByGroupCode = async (req, res) => {
    const { groupCode } = req.query;

    if (!groupCode) {
        return res.status(400).json({ success: false, message: 'groupCode is required' });
    }

    try {
        const [pets] = await db.query(
            'SELECT id, name, emoji, type FROM pets WHERE group_code = ?',
            [groupCode]
        );
        
    

        res.status(200).json({ success: true, pets });

    } catch (err) {
        console.error('Error fetching pets:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Fetch pets for a specific user
exports.getPetsByUser = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
    }

    try {
        const [pets] = await db.query(
            'SELECT id, name, emoji, type FROM pets WHERE owner_id = ?',
            [userId]
        );

        res.status(200).json({ success: true, pets });

    } catch (err) {
        console.error('Error fetching pets:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a pet
exports.deletePet = async (req, res) => {
    const { petId } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM pets WHERE id = ?',
            [petId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }

        res.status(200).json({ success: true, message: 'Pet deleted successfully' });

    } catch (err) {
        console.error('Error deleting pet:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

