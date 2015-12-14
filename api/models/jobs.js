var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

var jobSchema   = new Schema({
    _id: String,
    title: String,
    company: String,
    localization: String,
    category: String,
    description: String,
    contract: String,
    date: Date,
    tags: { type: [String], index: true } 
});

module.exports = mongoose.model('Job', jobSchema);
