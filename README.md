# Event-Management-API-CASHPOSITIVE

This is an Assignment for CASHPOSITIVE. It's a NodeJS application to provide REST APIs for an event
management interface.

The focus of this assignment is meant to be on backend. 

It's made using NodeJS, Express & MongoDB and uses PassportJS for user authentication and authorization.
Also it uses ejs as a templating language.

## Features

The app has a minimal overall interface and keeps design formalities out of the way.
Its starts with the root route. From where the user can go to view all events.
The user can login or a new user can signup in order to gain event and comment creation functionalities.

### Express

The app uses expressJS for the routing. The basic routes include: 

/events        : View all events route(GET)
/events        : Create events route(POST)
/events/:id    : View event details route(GET)
/events/:id    : Update event route(PUT)
/events/:id    : Delete event route(DELETE)

/events/:id/comments : Create comment route(POST)

### PassportJS

The app uses passportJS and express-session for user auth:

```javascript
//Passport config
app.use(require('express-session')({
  secret: 'Passcode!!!',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //local auth
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```

Auth methods are attatched to the user model, using passport-local-mongoose for local auth:

```javascript
var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose'); //Requiring passport-local-mongoose

var UserSchema = new mongoose.Schema({
  type: String,
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose); //Importing built in auth methods into the user model

module.exports = mongoose.model("User", UserSchema);
```


The website has been hosted on heroku https://quiet-atoll-30697.herokuapp.com/.
