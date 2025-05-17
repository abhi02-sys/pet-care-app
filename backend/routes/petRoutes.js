// routes/petRoutes.js
const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

router.post('/create', petController.createPet);
router.get('/', petController.getPetsByGroupCode);
router.get('/user', petController.getPetsByUser); // Fetch pets for user
router.delete('/:petId', petController.deletePet); // Delete a specific pet by ID

module.exports = router;
