import createHttpError from "http-errors"
import { verifyJWTToken } from "../jwt-tools.js";

export const JWTAuth = async(req,res,next) => {
    if(req.headers.authorization) {
        try {
            const JWTToken = req.headers.authorization.replace("Bearer ", "");
            const payload = await verifyJWTToken(JWTToken)

            req.user = {
                _id: payload._id
            }

            next();
        } catch (error) {
            next(createHttpError(401, "Token is not valid!"))
        }
    } else {
        next(createHttpError(401, "Please provide bearer token in the authorization header!"))
    }
}