const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    name: {type: String, required: true},
    //check if address is a string
    address: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    //what data type?
    openingHours: {type: String},
    prescriptions: {type: String},
    licenses: {type: String},
    //what type is rating
    rating: {type: Number},
    storeImage: {type: String},
    //person who created the store
    //what type is user comments
    reviews: [
        {
            user: {type: String },
            comments: {type: String, required: true
        }
    }]
}, { timestamps: true
});

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;

