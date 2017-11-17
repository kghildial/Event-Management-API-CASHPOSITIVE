var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Event = require('./models/event')
var seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost/eventdb');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


//Root route
app.get('/', function(req, res){
  res.render('index');
});

//Get all events route
app.get('/events', function(req, res){
  Event.find({}, function(err, allEvents){
    if(err){
      console.log(err);
    }
    else{
      res.render('events', {events: allEvents});
    }
  });
});

//Get event details route
app.get('/events/:id', function(req, res){
  Event.findById(req.params.id).populate('comments').exec(function(err, event){
    if(err){
      console.log(err);
    }
    else{
      res.render('show', {event: event});
    }
  });
});


//Add new comment form
app.get('/events/:id/comments/new', function(req, res){
  Event.findById(req.params.id, function(err, event){
    res.render('comments/new', {event: event});
  });
});

app.listen(3000, function(){
  console.log('Server started...');
});
