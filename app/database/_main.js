

const config = require('../config/main.js').mongodb;

const mongoose = require('mongoose');
mongoose.connect(config.uri);
module.exports = mongoose;