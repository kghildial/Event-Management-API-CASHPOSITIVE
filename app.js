var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


//Root route
app.get('/', function(req, res){
  res.send('Root route!');
});

app.listen(3000, function(){
  console.log('Server started...');
});
