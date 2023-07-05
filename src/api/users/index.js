import express from "express";
import UsersModel from "./model.js";
import createHttpError from "http-errors";
import { createJWTToken, createTokens, verifyRefreshAndCreateNewTokens } from './../../lib/jwt-tools.js';
import { JWTAuth } from "../../lib/auth/JWTAuth.js";

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

//get own profile after auth
usersRouter.get("/me", JWTAuth, async(req, res, next) => {
    try {
        const {_id} = req.user;
        const user = await UsersModel.findById(_id);
        res.send(user);
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
            res.send({email})
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
usersRouter.post("/signupLoginEmail", async(req, res, next) => {
    try{
        const {email} = req.body;
        const user = await UsersModel.checkEmail(email)

        if(user) {
            //login: if user exist, check credentials and return user
            const {email, password} = req.body;
            const user = await UsersModel.checkCredentials(email, password)

            if (user){
                const {JWTToken, refreshToken} = await createTokens(user);
                res.send({JWTToken, refreshToken})
            } else {
                next(createHttpError(404, "Credentials are not ok!"))
            }

        } else {
            //signup: if user not exist, create new user

            const newUser = new UsersModel(req.body);
            const {_id} = await newUser.save();
            const {JWTToken, refreshToken} = await createTokens(newUser);
            res.status(201).send({JWTToken, refreshToken})
        }

    } catch(error){
        next(error)
    }
})

//To create new tokens with verifying refresh token first
usersRouter.post("/signupLogin/refresh", async(req, res, next) => {
    try {
        const {currentRefreshToken} = req.body;
        const {JWTToken, refreshToken} = await verifyRefreshAndCreateNewTokens(currentRefreshToken)
        res.send({JWTToken, refreshToken});
    } catch (error) {
        next(error)
    }
})

//user login
export default usersRouter;