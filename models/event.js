var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  organiser: String,
  location: String,
  description: String,
  ticket_price: Number
});

module.exports = mongoose.model('Eventpost', eventSchema);
