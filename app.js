var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Event = require('./models/event')
var seedDB = require('./seeds');
var Comment = require('./models/comment');

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

//New event form
app.get('/events/new', function(req, res){
  res.render('new');
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

//Create event to db
app.post('/events', function(req, res){
  var title = req.body.title;
  var date = req.body.date;
  var organiser = req.body.organiser;
  var location = req.body.location;
  var description = req.body.description;
  var ticket_price = req.body.ticket_price;
  var newEvent = {
    title: title,
    date: date,
    organiser: organiser,
    description: description,
    location: location,
    ticket_price: ticket_price
  };
  Event.create(newEvent, function(err, newEvent){
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/events');
    }
  });
});

//Add new comment form
app.get('/events/:id/comments/new', function(req, res){
  Event.findById(req.params.id, function(err, event){
    res.render('comments/new', {event: event});
  });
});

//Create comment route
app.post('/events/:id/comments', function(req, res){
  console.log(req.body);
  Event.findById(req.params.id, function(err, event){
    if(err){
      console.log(err);
        res.redirect('back');
    }
    else{
      console.log(req.body);
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        }
        else{
          comment.author = req.body.author;
          comment.text = req.body.text;
          comment.save();
          event.comments.push(comment);
          event.save();
          res.redirect('/events/' + event._id);
        }
      });
    }
  });
});

app.listen(3000, function(){
  console.log('Server started...');
});
