const mongoose = require("mongoose");
const UserSchema = require("./dbSchema");

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;