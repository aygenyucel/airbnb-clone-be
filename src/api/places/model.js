import { Schema, model } from "mongoose";


const placesSchema = new Schema({
    structure: {type: String, require: true},
    //type of place (House, Apartment, Boat....)

    //**************************************/

    privacyType: {type: String, require: true},
    //type of place will guests have (An entire place/a room/a shared room)

    //**************************************/

    location: {type: Geolocation},

    country: {type: String, require: true},
    //Country / Region

    town: {type: String, require: true},
    //Town / neighborhood

    streetAddress: {type: String, require: true},

    postalCode: {type: Number},
    
    district: {type: String},
    //district, subdistrict

    city: {type: String, require: true},

    additional: {type: String},
    //Unit, floor, bldg, etc. 
    
    showLocation: {type: Boolean, default: false},

    //**************************************/

    numOfGuests: {type: Number, default: 1},
    //min 1

    numOfBedrooms: {type: Number, default: 1},
    //min 0

    numOfBeds: {type: Number, default: 1},
    //min 1

    numOfBathrooms: {type: Number, default: 1},
    //min 1
    
    
}, {timestamps:true})

export default model("Place", placesSchema);