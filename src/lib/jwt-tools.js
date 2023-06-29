import jwt from "jsonwebtoken";

export const createJWTToken = (payload) => new Promise(
    (resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1w"}, (err, token) => {
            if(err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    }
)

export const verifyJWTToken = (token) => new Promise(
    (resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, originalPayload) => {
            if(err) {
                reject(err)
            } else {
                resolve(originalPayload)
            }
        })
    }
)