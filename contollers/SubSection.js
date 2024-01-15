const SubSection=require("../models/SubSection")
const Section = require("../models/Course")
const { uploadImageToCloudinary } = require("../utils/imageUploader")



//create SubSection
exports.createSubSection=async(req,res)=>{
    try{
        //data fetch 
        const {sectionId,title,timeDuration,description}=req.body
        //extract file/video
        const video=req.files.videoFile
        //validation
        if(!sectionId || !title || !timeDuration || !description || !video){

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
            {new:true});
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
//HW:delete subsection