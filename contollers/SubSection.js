const SubSection=require("../models/SubSection")
const Section = require("../models/Course")
const { uploadImageToCloudinary } = require("../utils/imageUploader")



//create SubSection
exports.createSubSection=async(req,res)=>{
    try{
        //data fetch 
        const {sectionId,title,description}=req.body
        //extract file/video
        const video=req.files.videoFile
        //validation
        if(!sectionId || !title  || !description || !video){

            return res.staus(500).json({
                success:false,
                message:'All fields are required'
            })
        }
        //upload video to cloudinary
        const uploadDetails= await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        //create sub section
        const SubSectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        //update to section with sub section id
        const updatedSubSection= await Section.findByIdAndUpdate({ _id:sectionId},
            {$push:{
                    subSection:SubSectionDetails._id
                   }
            },
            {new:true}).populate('subSection').exec();
        //HW: populte and log send in response 
        //return res
        return res.staus(200).json({
            success:false,
            message:'Sub Section created successfully',
            updatedSubSection
        })
         

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:'Unable to create sub section  '
        });


    }
}
//HW:update subsection
exports.updateSubSection=async(req,res)=>{
    try{
      const {subSectionId,title,description}=req.body;
      const subsectionDetails=await SubSection.findOne({_id:subSectionId})
      if(!subsectionDetails){
        return res.status(404).json({
            success:false,
            message:"No section found",
        })
      }
      if(title)
      {
        subsectionDetails.title=title;
      }
      if(description){
        subsectionDetails.description=description
      }
     const video=req.files.videoFile
      if(req.files && video){
        const uploadDetails = await uploadImageToCloudinary( video, process.env.FOLDER_NAME )
        subsectionDetails.videoUrl = uploadDetails.secure_url
        subsectionDetails.timeDuration = `${uploadDetails.duration}`
      }
      const updatedSubSection=  await SubSection.findByIdAndUpdate({_id:subSectionId},subsectionDetails);
      return res.status(200).json({
        success:true,
        message:`Updated ${title} successfully`,
        data:updatedSubSection
      })

    }catch(error){
        return res.status(404).json({
            success:false,
            message:`Error while updating subsection of ${title} `,
            error:error
        })
    }
}

//HW:delete subsection
exports.deleteSubSection= async(req,res)=>{
    try{
        const {subSectionId}=req.body;
        if(!subSectionId){
            return res.status(404).json({
                success:false,
                message:`Subsection not found`
            })
        }

        const deleted= await SubSection.findByIdAndDelete(subSectionId)

        return res.status(200).json({
            success:true,
            message:'Deleted subsection successfully!!',
            data:deleted
        })

    }catch(error){
        return res.status(404).json({
            success:false,
            message:`Error while deleting subsection . `,
            error:error
        })
    }

}