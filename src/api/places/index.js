import createHttpError from "http-errors";
import PlacesModel from "./model.js"
import express from 'express';

const placesRouter = express.Router()


//get all places
placesRouter.get("/", async(req, res, next) => {
    try {
        const places = await PlacesModel.find({});
        res.send(places)
    } catch (error) {
        console.log("oppss, error:", error)
        next(error)
    }
})


//post a new place
placesRouter.post("/", async(req, res, next) => {
    try {
        const newPlace = new PlacesModel(req.body);
        const {_id} = await newPlace.save();

        res.status(201).send({_id})
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

export default placesRouter