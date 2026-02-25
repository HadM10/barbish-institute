const express = require('express');
const { createContact, getAllContacts, updateContactStatus, deleteContact } = require('../controllers/contactController');

const router = express.Router();

// POST : Create a new contact request
router.post("/", createContact);

// GET : Get all contact requests
router.get("/", getAllContacts);

// PATCH : Update the status of contact request
router.patch("/:id", updateContactStatus);

// DELETE : Delete a contact request
router.delete("/:id", deleteContact);

module.exports = router; // Correctly exporting the router
