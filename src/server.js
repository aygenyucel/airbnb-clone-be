import express from "express";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import createHttpError from "http-errors";


dotenv.config();

const server = express();
const port = process.env.PORT;


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

//************ ERROR HANDLERS *************/

//************************************ */


server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server is running on port:", port);
})


