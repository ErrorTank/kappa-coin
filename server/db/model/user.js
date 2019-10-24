const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    fullname: {
        type: String,
        minlength: 6,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {type: String},

    updatedAt: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},

});




module.exports = (appDb) => appDb.model("User", userSchema);