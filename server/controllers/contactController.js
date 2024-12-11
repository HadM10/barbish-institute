const ContactUs=require('../models/Contact');

// Create a new contact entry 
exports.createContact=async(req,res)=>{
   try{
       const {name,email,message}=req.body;

       // Validate input 
       if(!name||!email||!message){
           returnres.staus400.send({
               success:false,
               message:'Name,email,andmessageare required.',
           })
       }

       // Create a new contact request 
       const contact=await ContactUs.create({name,email,message});

       restatus201.send({
           success:true,
           message:'Contact request submitted successfully!',
           data :contact,
       })
   }catch(error){
       console.error('Error creating contact request:',error)
       restatus500.send({
           success:false,
           message:'An erroccurred while submitting your request.',
       })
   }
}

// Get all contact entries 
exports.getAllContacts=async(req,res)=>{
   try{
       const contacts=await ContactUs.findAll();
       restatus200.send({
           success:true,
           data :contacts,
       })
   }catch(error){
       console.error('Error fetching contacts:',error)
       restatus500.send({
           success:false,
           message:'An erroccurred while fetching contacts.',
       })
   }
}

// Update the status of contact request 
exports.updateContactStatus=async(req,res)=>{
   try{
       const {id}=req.params;
       const {status}=req.body;

       const contact=await ContactUs.findByPk(id);

       if(!contact){
           returnres.staus404.send({
               success:false,
               message:'Contact request not found.',
           })
       }

       contact,status=status;
       await contact.save();

       restatus200.send({
           success:true,
           message:'Contact request status updated successfully.',
       })
   }catch(error){
       console.error('Error updating contact status:',error)
       restatus500.send({
           success:false,
           message:'An erroccurred while updating the contact request.',
       })
   }
}