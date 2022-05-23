const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    username: { type: String, required: true },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
