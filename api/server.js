//LIBS
var express = require('express');
var remixjobs = express.Router();
var util = require('util');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

//DATABASE TABLE SCHEMAS
var Student = require('./models/students');
var Job = require('./models/jobs');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://localhost/remixjobs');

// test route to make sure everything is working
remixjobs.get('/', function(req, res) {
    res.json({
      message: 'Welcome to the unofficial RemixJobs API',
    });
});

remixjobs.route('/jobs')
.get(function(req, res) {
  Job.find(function(err, jobs) {
    if (err) {
      res.send(err);
    }

    res.status(200).json(jobs);
  });
})
.post(function(req, res) {
  var body = req.body;
  var fieldsValid = checkJobFields(body);

  var j_id = new ObjectID();
  var job = fillJob(body);
  job._id = j_id;
  var job_info = fillJobJson(job);

  if(!fieldsValid){
    res.status(400).json({
        message: 'No job created. You did not send enough information to create that job.',
        data: job_info
      }
    );
  }
  else {
      job.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.status(201).json({
            'message': 'Job created!',
            'id': j_id,
            'job_info': checkUndefined(job_info),
          }
        );
      });
  }
});

remixjobs.route('/jobs/:page')
.get(function(req, res) {
  if(req.params.page === 'latest'){
    Job.find().limit(10).exec(function(err, jobs) {
        if (err){
          res.send(err);
        }
        else if(jobs == null){
          jobs =
          {
            'message' : 'Aucun résultat trouvé.'
          };
        }
        res.json(jobs);
    });
  }
  else{
    var job_id = req.params.page;
    Job.findById(job_id, function(err, job) {
        if (err){
          res.send(err);
        }
        if(job == null)
          job =
          {
            'message' : 'Aucun résultat trouvé.'
          };
        res.json(job);
    });
  }
})
.put(function(req, res) {
  var body = req.body;

  var job = fillJob(body);
  job._id = req.params.page;
  var job_info = fillJobJson(job);

  Job.update({'_id':job._id}, job.toObject(), { multi: false }, function(err, raw) {
    if (err) {
      res.send(err);
    }
    res.status(201).json({
        'message': 'Job updated!',
        'id': job._id,
        'original_data': raw,
      }
    );
  });
});

// remixjobs.route('/jobs/latest')
// .get(function(req, res) {
//   res.json({'hein':'what'});
// });

remixjobs.route('/companies')
.get(function(req, res) {
  Job.find().distinct('company', function(err, jobs) {
      if (err){
        res.send(err);
      }
      else if(jobs == null){
        jobs =
        {
          'message' : 'Aucun résultat trouvé.'
        };
      }
      res.json(jobs);
  });
});
remixjobs.route('/companies/:id_company')
.get(function(req, res) {
  Job.find({'company': req.params.id_company,})
  .distinct('company', function(err, jobs) {
      if (err){
        res.send(err);
      }
      else if(jobs == null){
        jobs =
        {
          'message' : 'Aucun résultat trouvé.'
        };
      }
      res.json(jobs);
  });
});


remixjobs.route('/companies/:id_company/jobs')
.get(function(req, res) {
  Job.find({'company': req.params.id_company,}).exec(function(err, jobs) {
      if (err){
        res.send(err);
      }
      else if(jobs == null){
        jobs =
        {
          'message' : 'Aucun résultat trouvé.'
        };
      }
      res.json(jobs);
  });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', remixjobs);
app.listen(3000, function(){
	console.log('listening on port *:3000');
});


//METHODS
function fillJob(body){
  var job = new Job();
  if(body != undefined)
  {
    if(checkUndefined(body.title) !== 'undefined')
      job.title         = body.title;
    if(checkUndefined(body.company) !== 'undefined')
    job.company       = body.company;
    if(checkUndefined(body.localization) !== 'undefined')
    job.localization  = body.localization;
    if(checkUndefined(body.category) !== 'undefined')
    job.category      = body.category;
    if(checkUndefined(body.description) !== 'undefined')
    job.description   = body.description;
    if(checkUndefined(body.contract) !== 'undefined')
    job.contract      = body.contract;
    if(checkUndefined(body.date) !== 'undefined')
    job.date          = body.date;
    if(checkUndefined(body.tags) !== 'undefined')
    job.tags          = body.tags;
  }
  return job;
}

function fillJobJson(job){
  var job_info;
  if(job != null){
    job_info = {
      "title" : checkUndefined(job.title),
      "company" : checkUndefined(job.company),
      "localization" : checkUndefined(job.localization),
      "category" : checkUndefined(job.category),
      "description" : checkUndefined(job.description),
      "contract" : checkUndefined(job.contract),
      "date" : checkUndefined(job.date),
      "tags" : checkUndefined(job.tags),
    };
  }
  return job_info;
}

function checkStudentFields(body){
    var OK = true;
    if(body == null || body == undefined)
    {
      OK = false;
    }
    else
    {
      if(body.name == null || body.name == undefined)
        OK = false;
      if(body.grade == null || body.grade == undefined)
        OK = false;
      if(body.intern == null || body.intern == undefined)
        OK = false;
    }
    return OK;
}

function checkUndefined(field){
  return (field == undefined) || (field == null) ? "undefined" : field;
}

function checkJobFields(body){
    var OK = true;
    if(body == null || body == undefined)
    {
      OK = false;
    }
    else
    {
      if(body.title == null || body.title == undefined)
        OK = false;
      if(body.company == null || body.company == undefined)
        OK = false;
      if(body.localization == null || body.localization == undefined)
        OK = false;
      if(body.category == null || body.category == undefined)
        OK = false;
      if(body.contract == null || body.contract == undefined)
        OK = false;
      if(body.date == null || body.date == undefined)
        OK = false;
      if(body.tags == null || body.tags == undefined)
        OK = false;
    }
    return OK;
}
