import {model, Schema} from "mongoose";

const usersSchema = new Schema({
    name: {type: String},
    surname: {type: String},
    email: {type: String},
    password: {type: String},
    phone: {type: Number},
    birthDate: {type: Date},
    places: [{type: Schema.Types.ObjectId, ref: "Place"}]
},
{timestamps: true})


export default model("User", usersSchema);