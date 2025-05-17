const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ GET group code for a user (either owner or caregiver)
router.get('/group-code/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Check if user is a group owner
    const [ownerResult] = await db.query(
      "SELECT group_code FROM `groups` WHERE owner_id = ? LIMIT 1",
      [userId]
    );

    if (ownerResult.length > 0) {
      return res.json({ success: true, groupCode: ownerResult[0].group_code });
    }

    // Check if user is a caregiver in grp_members
    const [caregiverResult] = await db.query(
      `SELECT g.group_code FROM grp_members gm
       JOIN \`groups\` g ON gm.group_id = g.id
       WHERE gm.user_id = ? LIMIT 1`,
      [userId]
    );

    if (caregiverResult.length > 0) {
      return res.json({ success: true, groupCode: caregiverResult[0].group_code });
    }

    // Not found
    res.status(404).json({ success: false, message: "Group code not found for user" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ GET all members of a group by groupCode
router.get('/groups/:groupCode/members', async (req, res) => {
  const groupCode = req.params.groupCode;

  try {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.email
       FROM users u
       JOIN grp_members gm ON u.id = gm.user_id
       JOIN \`groups\` g ON gm.group_code = g.group_code
       WHERE g.group_code = ?`,
      [groupCode]
    );

    return res.json({ success: true, members: rows });
  } catch (err) {
    console.error("Error fetching group members:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
