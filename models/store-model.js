const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("./user-model");

const storeSchema = new Schema({
    storeName: {type: String, required: true},
    storeAddress: {type: String, required: true},
    storeZip: {type: String, required: true},
    storeCity: {type: String},
    storeCountry: {type: String},
    storePhoneNumber: {type: String, required: true},
    prescriptions: {type: Array},
    licenses: {type: Array},
    services: {type: Array},
    rating: {type: Number},
    reviews: [
        {
            reviewer: {type: String },
            comments: {type: String, required: true
        }
    }]
}, { timestamps: true
});

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;

