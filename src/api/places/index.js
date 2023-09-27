import createHttpError from "http-errors";
import PlacesModel from "./model.js"
import express from 'express';
import multer from "multer";
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import UsersModel from "../users/model.js"
import uploadImage from "../../lib/cloudinary/uploadImage.js";
import bodyParser from "body-parser";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

const placesRouter = express.Router();

placesRouter.use(bodyParser.urlencoded({extended: false}))
placesRouter.use(bodyParser.json())
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//specify the storage egine
const storage = multer.diskStorage({
    // destination: function(req, file, cb){
    //     cb(null, path.join(__dirname, '/uploads/'));
    // },
    // filename: function (req, file, cb) {
    //     cb(null, Date.now() +"-" +  file.originalname)
    // }
})

const upload = multer({
    storage: storage,
})

//get all places
placesRouter.get("/", async(req, res, next) => {
    try {
        if(req.query != {}){
            // console.log("req.query =>", req.query)
            const searchedPlaces = await PlacesModel.find(req.query)
            // console.log("searched places", searchedPlaces)
            res.send(searchedPlaces)s
        } else {
            const places = await PlacesModel.find({});
            res.send(places)
        }
    } catch (error) {
        console.log("oppss, error:", error)
        next(error)
    }
})


placesRouter.post("/uploadImages", upload.array('placeImages'), async(req, res, next) => {
    try {
        const urls = []
        const files = req.files

        for(const file of files) {
            const  {path} = file
            await uploadImage(path).then(secure_url => {
                urls.push(secure_url)
            })
            fs.unlinkSync(path)
        }
        
        res.send({
            message: `image uploaded successfully`,
            data: urls
        })
        // .catch((err) => res.status(500).send(err))
    } catch (error) {
        next(error)
    }
})

//post a new place
placesRouter.post("/", async(req, res, next) => {
    try {
        const newPlace = new PlacesModel(req.body);
        const {_id} = await newPlace.save();
        // res.status(201).send({_id})
        if (newPlace) {
            const updatedUser = await UsersModel.findByIdAndUpdate(
                req.body.userID,
                { $push: { places: _id } },
                { new: true, runValidators: true }
                );
                if (updatedUser) {
                    res.status(201).send({_id});
                } else {
                    next(
                        createHttpError(404, `User with id ${req.body.userId} not found!`)
                        );
            }
          } else {
            next(createHttpError(400, `Please add a valid Place`));
        }
    } catch (error) {
        next(error)
    }
})

//get place by id
placesRouter.get("/:placeID", async(req, res, next) => {
    try {
        const place = await PlacesModel.findById(req.params.placeID);
        
        if(place) {
            res.send(place)
        } else {
            next(createHttpError(404, `Place with id ${req.params.placeID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//update place by id
placesRouter.put("/:placeID", async(req, res, next) => {
    try {
        const updatedPlace = await PlacesModel.findByIdAndUpdate(req.params.placeID,{...req.body})
        if(updatedPlace) {
            res.send(updatedPlace)
            console.log("updatedddjksdaldk", req.body)
        } else {
            next(createHttpError(404, `The place with id ${req.params.placeID} not found!`))
        }
    } catch (error) {
        next(error)   
    }
})

//delete place by id
placesRouter.delete("/:placeID", async (req, res, next) => {
    try {
        const deletedPlace = await PlacesModel.findByIdAndDelete(req.params.placeID);
        if(deletedPlace) {
            res.status(204).send();
        } else {
            next(createHttpError(404, `The place with id ${req.params.placeID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//upload place images
// placesRouter.post("/:placeID/uploadImages", cloudMulter.array("placeImages"), async(req, res, next) => {
    //     try {
        //         console.log("jdlkslfdskşfkdsfdsşfk")
        //         let imagesFiles = req.files;
        //         //checking if files exist
        
        //         if(!imagesFiles) {
            //             res.status(400).send()
            //         } else {
                //             const multipleImagePromise = imagesFiles.map((image) => {
//                 cloudinary.uploader.upload(image.path)
//             })

//             const imageResponses = await Promise.all(multipleImagePromise)
//             console.log("imageresponsesssss", imageResponses)
//             res.status(200).send({imageResponses})
//         }

//     } catch (error) {
    //         next(error)
    //     }
    // })
    
    
export default placesRouter