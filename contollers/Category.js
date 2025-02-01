const Category=require('../models/Category')

exports.createCategory=async(req,res)=>{
    try{
        const {name,description}=req.body;
        if(!name){
            return res.status(404).json({
                success:false,
                message:"Name required for creating category.",
            })
        }
        const categoryCreated=await Category.create({
            name,
            description
        })
        
        return res.status(200).json({
            success:true,
            message:'Created category succssFully',
            data:categoryCreated
        })


    }catch(error){
        return res.status(400).json({
            success:false,
            message:'Error while creating category',
            error:error
        })

    }
}

exports.showAllCategories = async (req, res) => {
	try {
        
		const allCategorys = await Category.find({});        

    return res.status(200).json({ success: true , data: allCategorys, });	 
	}
   catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryDetails

exports.categoryPageDetails = async (req, res) => {
    try{
        const { categoryId } = req.body

        const categoryDetails = await Category.findById(categoryId).populate({
            path:"courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",

        }).exec()
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:'No category found with Id',
            })
        }

        if(categoryDetails.courses.length===0){
             return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
          })
        }

        const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId }})
        
        const diffrentCategory= await Category.find({_id:categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id},{courses:{ $exists: true, $not: { $size: 0 }}}).populate({
                  path: "courses",
                  match: { status: "Published" },
                })
                .exec()

        const findAllCourses= await Category.find().populate({
            path:"courses",
             match: { status: "Published" },
             populate:{path:'studentsEnrolled'}

        })

        // Flatten the courses from all categories into a single array
        const allCourses = findAllCourses.flatMap(category => category.courses);

        // Sort the courses by the number of students enrolled in descending order
        const topEnrolledCourses = allCourses.sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length).slice(0, 10);

        return res.status(200).json({
        success: true,
        data: {selectedCategory, differentCategory, mostSellingCourses,}, 
      })





    }catch(error){
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
}