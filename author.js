const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

const AUthorModel = mongoose.model((AuthorSchema));

module.exports = AUthorModel;