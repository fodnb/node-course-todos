var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connection.openUri(process.env.MONGODB_URI || 'mongodb://localhost:27017/ToDoApp');

module.exports = {mongoose};