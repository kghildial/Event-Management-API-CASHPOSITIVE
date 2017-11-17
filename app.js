var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Event = require('./models/event');
var seedDB = require('./seeds');
var Comment = require('./models/comment');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');

seedDB();
mongoose.connect('mongodb://localhost/eventdb');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));


//Passport config
app.use(require('express-session')({
  secret: 'Passcode!!!',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

//Edit event route
app.get('/events/:id/edit', function(req, res){
  Event.findById(req.params.id, function(err, event){
    res.render('edit', {event: event});
  });
});

//Update event route
app.put('/events/:id', function(req, res){
  Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedEvent){
    if(err){
      res.redirect('/events');
    }
    else{
      res.redirect('/events/' + req.params.id);
    }
  });
});

//Delete event route
app.delete('/events/:id', function(req, res){
  Event.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      res.redirect('/events');
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

//Auth routes
app.get('/register', function(req, res){
  res.render('register');
});

app.listen(3000, function(){
  console.log('Server started...');
});
