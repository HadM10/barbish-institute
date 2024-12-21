// server/controllers/contactController.js
const ContactUs = require('../models/Contact');

// Create new contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    // Create contact with initial values
    const contact = await ContactUs.create({ 
      name, 
      email, 
      phone, 
      subject, 
      message,
      status: 'unread',
      replied: false
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message.',
      error: error.message
    });
  }
};

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages.',
      error: error.message
    });
  }
};

// Update contact status
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['read', 'unread'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be either "read" or "unread".'
      });
    }

    const contact = await ContactUs.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `No message found with id: ${id}`,
      });
    }

    contact.status = status;
    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Message status updated successfully.',
      data: contact
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status.',
      error: error.message
    });
  }
};

// Reply to contact
exports.replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage || replyMessage.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reply message cannot be empty.'
      });
    }

    const contact = await ContactUs.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `No message found with id: ${id}`,
      });
    }

    // Update contact with reply
    const updatedContact = await contact.update({
      replied: true,
      replyMessage: replyMessage,
      status: 'read'
    });

    // Here you can add email sending logic
    // await sendEmail(contact.email, 'Reply to your inquiry', replyMessage);

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully.',
      data: updatedContact
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply.',
      error: error.message
    });
  }
};

// Delete contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await ContactUs.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `No message found with id: ${id}`,
      });
    }

    await contact.destroy();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message.',
      error: error.message
    });
  }
};

// Get single contact
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await ContactUs.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `No message found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message.',
      error: error.message
    });
  }
};