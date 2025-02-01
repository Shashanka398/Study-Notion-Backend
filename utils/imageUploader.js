const cloudinary=require('cloudinary').v2

const uploadImageToCloudinary = async (file, folder, height, quality) => {
    console.log("Cloudinary upload");

    const options = { folder };
    if (height) {
        options.height = height;
    }
    if (quality) {
        options.quality = quality;
    }

    options.resource_type = "auto";
    console.log("File cloudinary", file);

    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        console.log("result",result)
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error; 
    }
};


module.exports=uploadImageToCloudinary