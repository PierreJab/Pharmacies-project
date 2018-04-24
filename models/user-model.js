const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Store = require("./store-model");

const userSchema = new Schema ({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    encryptedPassword: {type : String},
    role: {
        type: String,
        enum: ["Admin", "Pharmacy", "User"],
        default: "User"
    },
    status: {type: String, enum: ["Pending Confirmation", "Active"], default: "Pending Confirmation"},
    confirmationCode: {type: String, unique: true},
    profilePicture: {
        originalname: {type: String},
        secure_url: {type: String} 
    },
    phone: {type: String},
    address: {type: String},
    city: {type: String},
    zip: {type: String},
    country: {type: String},
    birthday: {type: Date},
    aboutMe: {type: String},
    social: {type: String},
    favorites: {type: Array}
    //link to the user to any stores that they might have created
    /* storesUploaded: {
        type: .....
        ref: "Store",
    } */
}, {
    timestamps: true
});

//add

userSchema.virtual("isAdmin").get(function(){
    return this.role === "Admin";
});

userSchema.virtual("isPharmacy").get(function(){
    return this.role === "Pharmacy";
});

const User = mongoose.model("User", userSchema);

module.exports = User;






