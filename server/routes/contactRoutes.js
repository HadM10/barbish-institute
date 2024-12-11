
const express=require('express');
const{createContact,getAllContacts ,updateContactStatus}=require('../controllers/contactController');

const router=express.Router();

// POST :Create anew contact request 
router.post('/contact',createContact);

// GET :Get all contact requests 
router.get('/contact',getAllContacts);

// PATCH :Update the status of contact request 
router.patch('/contact/:id',updateContactStatus);

module.exports= router; // Correctly exporting the router 
