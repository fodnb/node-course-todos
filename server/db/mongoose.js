var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connection.openUri('mongodb://localhost:27017/ToDoApp');

module.exports = {mongoose};