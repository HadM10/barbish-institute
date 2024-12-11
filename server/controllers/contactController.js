const ContactUs = require('../models/Contact');

// Create a new contact entry 
exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input 
    if (!name || !email || !message) {
      return res.status(400).send({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    // Create a new contact request 
    const contact = await ContactUs.create({ name, email, message });

    res.status(201).send({
      success: true,
      message: 'Contact request submitted successfully!',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact request:', error);
    res.status(500).send({
      success: false,
      message: 'An error occurred while submitting your request.',
    });
  }
};

// Get all contact entries 
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.findAll();
    res.status(200).send({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).send({
      success: false,
      message: 'An error occurred while fetching contacts.',
    });
  }
};

// Update the status of contact request 
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await ContactUs.findByPk(id);

    if (!contact) {
      return res.status(404).send({
        success: false,
        message: 'Contact request not found.',
      });
    }

    contact.status = status;  // Correct the assignment
    await contact.save();

    res.status(200).send({
      success: true,
      message: 'Contact request status updated successfully.',
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).send({
      success: false,
      message: 'An error occurred while updating the contact request.',
    });
  }
};
