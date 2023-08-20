import { v2 as cloudinary } from "cloudinary"

const uploadImage = (image) => {

    //image ==> base64
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    })
    
    const opts = {
        overwrite: true,
        invalidate: true,
        resource_type: "auto",
        folder: "placeImages"
        
    }

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (err, result) => {
            if(result && result.secure_url) {
                // console.log("secure urlll: ", result.secure_url);
                return resolve(result.secure_url)
            } else {
                console.log(err.message);
                return reject({ message: err.message})
            }
        })
    })

}

export default uploadImage;