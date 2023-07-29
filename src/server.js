import express from "express";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import http from "http";
import { badRequestErrorHandler, conflictErrorHandler, forbiddenErrorHandler, genericServerError, notFoundErrorHandler, unauthorizedErrorHandler } from "./errorHandlers.js";
import usersRouter from "./api/users/index.js";
import placesRouter from "./api/places/index.js";


dotenv.config();

const server = express();
const port = process.env.PORT;

const httpServer = http.createServer(server);


//************ MIDDLEWARES **************/

server.use(express.json());

const allowList = [process.env.FE_DEV_URL]

server.use(cors({
    origin: (origin, corsNext) => {
        if(!origin || allowList.indexOf(origin) !== -1) {
            corsNext(null, true);
        } else {
            corsNext(createHttpError(400, `Cors Error! Your origin ${origin} is not in the list!`))
        }
    }
}));


//************ ENDPOINTS  ***************/

server.use("/users", usersRouter);
server.use("/places", placesRouter);

//************ ERROR HANDLERS *************/

server.use(notFoundErrorHandler);
server.use(badRequestErrorHandler);
server.use(conflictErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(genericServerError);

//************************************ */

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_CONNECTION_URL);

mongoose.connection.on("connected", () => {
    httpServer.listen(port, () => {
        console.table(listEndpoints(server));
        console.log("Server is running on port:", port)        
    })
})

// server.listen(port, () => {
//     console.table(listEndpoints(server));
//     console.log("Server is running on port:", port);
// })


