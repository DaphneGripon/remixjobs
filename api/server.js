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

/*
* @route : /jobs
* GET : returns all the jobs on remixjobs.com
* POST : creates a new job in the database
*   @params : title, company, localization, description, category, tags, date,
              contract
*/
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

/*
* @route /jobs/:page
* GET : if :page is an iD -> returns the information of a specific job
        if :page === 'latest' -> returns the 20 latest jobs in the database
* PUT : updates a job with the :page param, which is the job iD in the database
*   @params : title OR company OR localization OR description OR category
              OR ags OR date OR contract
*/
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

/*
* @route /companies
* GET : returns a list of all the companies which have posted a job search
*/
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

/*
* @route /companies/:id_company
* GET : Returns the information of a specific company, with the id :id_company
*/
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

/*
* @route /companies/:id_company/jobs
* GET : Returns all the jobs posted by a specific company,
        thanks to its id :id_company
*/
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

/*
* @function returns a Job object, filled out with the parameters in the body
* @param : body : the name of the variable containing all the job information
                  here it is intended to be req.body from the routes
*/
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

/*
* @function returns a JSON object, filled out with the job information
* @param : Job job : the name of the job Object to be displayed
*/
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

/*
* @function returns true if the required fields (name, grade, intern)
            to create a student have been filled out, false otherwise.
* @param : body : the name of the variable containing all the student
                  information here it is intended to be req.body from the routes
*/
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

/*
* @function Returns the object value if it's not null or undefined.
            Returns "undefined" if it is null or undefined.
* @param : field : the object to be checked for null or undefined value
*/
function checkUndefined(field){
  return (field == undefined) || (field == null) ? "undefined" : field;
}

/*
* @function returns true if the required fields (title, company, localization,
            category, contract, date, tags) to create a job have been filled
            out, false otherwise.
* @param : body : the name of the variable containing all the student
                  information here it is intended to be req.body from the routes
*/
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
