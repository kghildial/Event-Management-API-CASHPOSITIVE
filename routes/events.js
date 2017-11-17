var express = require('express');
var router = express.Router();
var Event = require('../models/event');

//Get all events route
router.get('/events', function(req, res){
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
router.get('/events/new', isLoggedIn, function(req, res){
  res.render('new');
});

//Get event details route
router.get('/events/:id', function(req, res){
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
router.post('/events', function(req, res){
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
router.get('/events/:id/edit', function(req, res){
  Event.findById(req.params.id, function(err, event){
    res.render('edit', {event: event});
  });
});

//Update event route
router.put('/events/:id', function(req, res){
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
router.delete('/events/:id', function(req, res){
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

//Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect("/login");
  }
}

module.exports = router;