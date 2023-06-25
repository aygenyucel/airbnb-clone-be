import express from "express";
import UsersModel from "./model.js";
import createHttpError from "http-errors";

const usersRouter = express.Router();

//get all users
usersRouter.get("/", async(req, res, next) => {
    try{
        const users = await UsersModel.find({});
        res.send(users);
    } catch(error) {
        next(error)
    }
})

//post a new user
usersRouter.post("/", async(req, res, next) => {
    try {
        const newUser = new UsersModel(req.body);
        const {_id} = await newUser.save();

        res.status(201).send({id})
    } catch (error) {
        next(error)
    }
})

//get user by id
usersRouter.get("/:userID", async(req, res, next) => {
    try {
        const user = await UsersModel.findById(req.params.userID);

        if(user) {
            res.send(user)
        } else {
            next(createHttpError(404, `User with id ${req.params.userID} not found!`))
        }
    } catch(error) {
        next(error)
    }
})

//update user by id
usersRouter.put("/:userID", async(req, res, next) => {
    try {
        const updatedUser = await UsersModel.findByIdAndUpdate(req.params.userID, {...req.body}, {runValidators: true, new: true})
        
        if(updatedUser) {
            res.send(updatedUser)
        } else {
            next(createHttpError(404, `User with id ${req.params.userID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

//delete user by id
usersRouter.delete("/:userID", async(req,res,next) => {
    try {
        const deletedUser = await UsersModel.findByIdAndDelete(req.params.userID)

        if(deletedUser) {
            res.status(204).send();
        } else {
            next(createHttpError(404, `User with id ${req.params.userID} not found!`))
        }
        
    } catch (error) {
        next(error)
    }
})

//check email if user already exist
usersRouter.post("/checkEmailExist", async (req, res, next) => {
    try {
        const {email} = req.body;
        const user = await UsersModel.checkEmail(email)


        if(user) {
            //if user exist
            //FE: redirect to login page with this email and ask for password
            res.send(email)
        } else {
            //if user not exist
            //FE: redirect to signup page with this email
            
            
            next(createHttpError(404, `User with email "${email}" not found!`))
        }
    } catch(error) {
        next(error)
    }
})

//user signup or login with email
// usersRouter.post("/signupLoginEmail", async(req, res, next) => {
//     try{
//         const {email} = req.body;
//         const user = await UsersModel.checkEmail(email)

//         if(user) {
            
//         } else {

//         }

//     } catch(error){
//         next(error)
//     }
// })

//user login
export default usersRouter;