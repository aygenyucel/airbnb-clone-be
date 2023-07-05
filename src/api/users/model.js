import {model, Schema} from "mongoose";
import bcrypt from "bcrypt";

const usersSchema = new Schema({
    name: {type: String},
    surname: {type: String},
    email: {type: String},
    password: {type: String, required: true},
    phone: {type: Number},
    birthDate: {type: Date},
    places: [{type: Schema.Types.ObjectId, ref: "Place"}],
    refreshToken: {type: String, required: false}
},
{timestamps: true})


usersSchema.pre("save", async function(next) {
    const currentUser = this;

    if(currentUser.isModified("password")) {
        const plainPW = currentUser.password;
        const hashed = await bcrypt.hash(plainPW, 10);
        currentUser.password = hashed;
    }
    next();
})

usersSchema.static("checkCredentials", async function (email, password) {
    const UserModel = this;
    const user = await UserModel.findOne({email});
    if(user) {
        const passwordMatch = await bcrypt.compare(password, user.password)
        if(passwordMatch) {
            return user;
        } else {
            return null;
        }
    } else {
        return null;
    }
})

usersSchema.static("checkEmail", async function (email) {
    const UserModel = this;
    const user = await UserModel.findOne({email})
    if(user) {
        return email;
    } else {
        return null;
    }
})

export default model("User", usersSchema);