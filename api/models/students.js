var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema   = new Schema({
    name: String,
    intern: String,
    grade: String 
});

module.exports = mongoose.model('Student', studentSchema);
