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
      message: 'Welcome to Students API',
    });
});

remixjobs.route('/students')
  .post(function(req, res) {
    var body = req.body;
    var student = new Student();
    var s_id = new ObjectID();
    var fieldsValid = checkFields(req.body);

    student._id = s_id;
    if(body != undefined)
    {
      student.name = req.body.name;
      student.intern = req.body.intern;
      student.grade = req.body.grade;
    }

    var student_info = {
      "name" : student.name == undefined ? "Undefined" : student.name,
      "intern" : student.intern == undefined ? "Undefined" : student.intern,
      "grade" : student.grade == undefined ? "Undefined" : student.grade,
    };

    // console.log("student_info:"+util.inspect(student_info, {showHidden: false, depth: null}));

    if(!fieldsValid)
    {
      res.status(400).json(
        {
          message: 'No student created. You did not send enough information to create that student.',
          data: student_info
        }
      );
    }
    else {
        student.save(function(err) {
          if (err) {
            res.send(err);
          }
          res.status(201).json(
            {
              'message': 'Student created!',
              'id': s_id,
              'student_info': student_info==undefined?'undefined':student_info,
            }
          );
        });
    }
  } )
  .delete(function(req, res) {
    Student.remove(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Students removed!' });
    });
  })
  .get(function(req, res) {
    Student.find(function(err, students) {
      if (err) {
        res.send(err);
      }

      res.json(students);
    });
  });

remixjobs.route('/students/:student_id')
.get(function(req, res) {
  Student.findById(req.params.student_id, function(err, student) {
      if (err){
        res.send(err);
      }
      res.json(student);
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
  var message =
  {
    'message' : 'Not yet implemented'
  };
  res.status(501).json(message);
})
.put(function(req, res) {
  var message =
  {
    'message' : 'Not yet implemented'
  };
  res.status(501).json(message);
});

remixjobs.route('/jobs/:job_id')
.get(function(req, res) {
  Job.findById(req.params.job_id, function(err, job) {
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
});

remixjobs.route('/jobs/latest')
.get(function(req, res) {
  var message =
  {
    'message' : 'Not yet implemented'
  };
  res.status(501).json(message);
});

remixjobs.route('/companies')
.get(function(req, res) {
  var message =
  {
    'message' : 'Not yet implemented'
  };
  res.status(501).json(message);
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', remixjobs);
app.listen(3000, function(){
	console.log('listening on port *:3000');
});

function checkFields(body){
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
