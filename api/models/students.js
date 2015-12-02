var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

var studentSchema   = new Schema({
    _id: String,
    name: String,
    intern: String,
    grade: String
});

module.exports = mongoose.model('Student', studentSchema);
