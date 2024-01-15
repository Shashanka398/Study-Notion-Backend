const Section = require("../models/Course")
const Course = require("../models/Course")
exports.createSection=async(req,res)=>{
try{
    //data fetch
    const {sectionName,courseId}=req.body
      //data validation
    if(!sectionName || !courseId)
    {
        return res.status(400).json({
            success:false,
            message:'Missing section Name '
        });

    }
    //create section
    const newSection =await Section.create({sectionName});
    //update course with section Object Id
    const updatedCourseDetails= await Course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id}},{new:true}
    )
    //HW:use populte ti replace sectioons/subsection both in updatedcoursedetails
    //return response
    return res.status(200).json({
        success:true,
        message:'Section created successfully',
        updatedCourseDetails
    })
}
catch(error){
    return res.status(400).json({
        success:false,
        message:'Unable to created section  '
    });
}

}

exports.updateSection=async(req,res)=>{
    try{
        //data fetch
        const {sectionName,sectionId}=req.body
        //data validation
        if(!sectionName || !sectionId)
        {
            return res.status(400).json({
                success:false,
                message:'Missing section Name '
            });
    
        }
        //update data
        const updatedSection= await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        //return res
        return  res.status(200).json({
            success:true,
        message:'Section updated successfully',
        updatedSection
            
        })


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:'Unable to update section  '
        });

    }
}

exports.deleteSection=async(req,res)=>{
    try{
        const {sectionId}=req.body;
        await Section.findByIdAndDelete(sectionId)
        return  res.status(200).json({
            success:true,
        message:'Section deleted  successfully',
        updatedSection
            
        })


    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:'Unable to delete section  '
        });

    }
}