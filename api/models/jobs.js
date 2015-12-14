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
    tags: { type: [String], index: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);
