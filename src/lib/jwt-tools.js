import jwt from "jsonwebtoken";
import User from './../api/users/model.js';
import createHttpError from "http-errors";


export const createJWTToken = (payload) => new Promise(
    (resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "15m"}, (err, JWTToken) => {
            if(err) {
                reject(err)
            } else {
                resolve(JWTToken)
            }
        })
    }
)

export const verifyJWTToken = (JWTToken) => new Promise(
    (resolve, reject) => {
        jwt.verify(JWTToken, process.env.JWT_SECRET, (err, originalPayload) => {
            if(err) {
                reject(err)
            } else {
                resolve(originalPayload)
            }
        })
    }
)

export const createRefreshToken = (payload) => new Promise(
    (resolve, reject) => {
        jwt.sign(payload, process.env.REFRESH_SECRET,{expiresIn: "1w"}, (err, refreshToken) => {
            if(err) {
                reject(err)
            } else {
                resolve(refreshToken)
            }
        })
    }
)

export const verifyRefreshToken = (refreshToken) => new Promise(
    (resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, originalPayload) => {
            if(err) {

                reject(err)
            } else {
                resolve(originalPayload)
            }
        })
    }
)

//After user login, creates both tokens and save refresh token in db.
export const createTokens = async(user) => {
    const JWTToken = await createJWTToken({_id: user._id});
    const refreshToken = await createRefreshToken({_id: user._id});

    //refresh token saved in db
    user.refreshToken = refreshToken;
    await user.save();
    return {JWTToken, refreshToken} 
}


//for the /signupLogin/refresh endpoint. To create new tokens with verify refresh token first
export const verifyRefreshAndCreateNewTokens = async(currentRefreshToken) => {
    //checking integrity and expiration date of refresh token
    const {_id} = await verifyRefreshToken(currentRefreshToken);
    console.log("wwoowwoo", _id)

    const user = await User.findById(_id);

    if(user) {
            const {JWTToken, refreshToken} = await createTokens(user)
            return {JWTToken, refreshToken, user};
        
    } else {
        throw createHttpError(404, `User with id ${_id} not found!`)
    }
}