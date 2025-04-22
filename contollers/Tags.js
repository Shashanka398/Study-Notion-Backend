const Tags=require(".././models/Tags")

//create tag
exports.createTag=async(req,res)=>{
    try{
        const {name,description}=req.body;
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:'All field required'
            })
        }
        const tagDetails= await Tags.create({
            name:name,
            descriptiom:description
        })
        console.log(tagDetails)

        return res.status(200).json({
            success:true,
            message:"Tag created successfully"
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



exports.showAllTages=async(req,res)=>{
    try{
        const allTags=await Tags.find({},{name:true,descriptiom:true});
        res.status(200).json({
            success:true,
            messages:"All tags returned successfully!!",
            allTags
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })

    }
}