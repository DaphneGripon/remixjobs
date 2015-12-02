var express = require('express');
var router = express.Router();
var app = express();
var Student = require('./models/students');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://localhost/remixjobs');

// test route to make sure everything is working
router.get('/', function(req, res) {
    res.json({
      message: 'Welcome to Students API'
    });
});

router.route('/students')
  .post(function(req, res) {
    var student = new Student();
    var s_id = new ObjectID();
    student._id = s_id;
    student.name = "daphne";
    student.intern = "hallo";
    student.grade = "20";
    student.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Student created!', id: s_id});
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

router.route('/students/:student_id')
.get(function(req, res) {
  Student.findById(req.params.student_id, function(err, student) {
      if (err){
        res.send(err);
      }
      res.json(student);
  });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
app.listen(3000, function(){
	console.log('listening on port *:3000');
});
