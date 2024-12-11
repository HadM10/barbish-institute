const Course=require("../models/Course");

// Get all courses 
exports.getAllCourses=async(req,res)=>{
	try{
		const courses=await Course.findAll();
		res.staus200.send(courses);
	}catch(error){
	    restatus500.send ({error:"Error fetching courses",details:error.message});
   }
}

// Get a course by ID 
exports.getCourseById=async(req,res)=>{
	try{
	    const course=await Course.findByPk(req.params.id);
	    if(!course)returnres.staus404.send ({error:"Course not found"});

	    restatus200.send(course);
	}catch(error){
	    restatus500.send ({error:"Error fetching course",details:error.message});
   }
}

// Create a new course 
exports.createCourse=async(req,res)=>{
	try{
	    const {title,image ,description ,content ,price ,duration}=req.body;

	    const newCourse=await Course.create({
	        title,
	        image,
	        description,
	        content,
	        price,
	        duration,
	    });
	    restatus201.send(newCourse);
   }catch(error){
       restatus500.send ({error:"Error creating course",details:error.message});
   }
}

// Update a course by ID 
exports.updateCourse=async(req,res)=>{
	try{
	    const course=await Course.findByPk(req.params.id);
	    if(!course)returnres.staus404.send ({error:"Course not found"});

	    const updatedCourse=await course.update(req.body);
	    restatus200.send(updatedCourse);
   }catch(error){
       restatus500.send ({error:"Error updating course",details:error.message});
   }
}

// Delete a course by ID 
exports.deleteCourse=async(req,res)=>{
	try{
	    const course=await Course.findByPk(req.params.id);
	    if(!course)returnres.staus404.send ({error:"Course not found"});

	    await course.destroy();
	    restatus200.send ({message:"Course deleted successfully"});
   }catch(error){
       restatus500.send ({error:"Error deleting course",details:error.message});
   }
}