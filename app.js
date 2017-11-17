var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


//Root route
app.get('/', function(req, res){
  res.render('index');
});

//Get all events route
app.get('/events', function(req, res){
  res.render('events');
});

//Get event details route
app.get('/events/:id', function(req, res){
  res.render('show');
});

app.listen(3000, function(){
  console.log('Server started...');
});
