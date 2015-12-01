var express = require('express');
var router = express.Router();
var app = express();
var Student = require('./models/students');

// test route to make sure everything is working
router.get('/', function(req, res) {
    res.json({
      message: 'Welcome to Students API'
    });
});

router.route('/students')
  .post(function(req, res) {
    var student = new Student();
    student.name = req.body.name;
    student.intern = req.body.intern;
    student.grade = req.body.grade;
    student.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Student created!' });
    });
  });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
app.listen(3000, function(){
	console.log('listening on port *:3000');
});
