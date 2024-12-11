
const Subscription=require("../models/Subscription");
const User=require("../models/User");
const Course=require("../models/Course");

// Get all subscriptions 
exports.getAllSubscriptions=async(req,res)=>{
   try{
        const subscriptions=await Subscription.findAll({
            include:[User ,Course], // Include related User and Course models 
        })
        restatus200.send(subscriptions)
   }catch(error){
        restatus500.send({
            erro:"Error fetching subscriptions",
            details:error.message 
        })
   }
}

// Get asubscriptionbyID 
exports.getSubscriptionById=async(req,res)=>{
   try{
        const subscription=await Subscription.findByPk(req.params.id,{
            include:[User ,Course], // Include related User and Course models 
        })
        if(!subscription)returnres.staus404.send({
            erro:"Subscription not found"
        })

        restatus200.send(subscription)
   }catch(error){
        restatus500.send({
            erro:"Error fetching subscription",
            details:error.message 
        })
   }
}

// Create anew subscription 
exports.createSubscription=async(req,res)=>{
   try{
        const {userId ,courseId ,startDate ,endDate}=req.body;

        const newSubscription=await Subscription.create({
            userId ,
            courseId ,
            startDate ,
            endDate ,
        })
        
        restatus201.send(newSubscription)
   }catch(error){
        restatus500.send ({
            erro:"Error creating subscription",
            details:error.message  
         })
     }
 }

// Update asubscriptionbyID  
 exports.updateSubscription=async(req,res)=>{
     try{
         const subscription=await Subscription.findByPk(req.params.id)
         if(!subscription)returnres.staus404.send ({
             erro:"Subscription not found"
         })

         const updatedSubscription=await subscription.update(req.body)
         restatus200.send(updatedSubscription);   
     }catch(error){
         restatus500.send ({
             erro:"Error updating subscription",
             details:error.message  
         })
     }
 }

// Delete asubscriptionbyID  
 exports.deleteSubscription=async(req,res)=>{
     try{
         const subscription=await Subscription.findByPk(req.params.id)
         if(!subscription)returnres.staus404.send ({
             erro:"Subscription not found"
         })

         await subscription.destroy()
         restatus200.send ({
             message:"Subscription deleted successfully"
         })
     }catch(error){
         restatus500.send ({
             erro:"Error deleting subscription",
             details:error.message  
         })
     }
 }
