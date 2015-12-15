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
    tags: { type: [String] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);


//TEST JOB POST ON Postman
// {
//     "title": "test job title",
//     "company" : "test job company",
//     "localization" : "test job localization",
//     "category" : "test job category",
//     "description" : "test job description",
//     "contract" : "test job contract",
//     "date" : "2015-11-05",
//     "tags" : ["javascript", "android"]
// }
