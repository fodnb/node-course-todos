var {mongoose} = require("./db/mongoose");
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var ObjectId = mongoose.Types.ObjectId;

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 4000;

			
app.use(bodyParser.json());

// CRUD create read update delete

// for /todo's to create new todo
app.post("/todos", (req, res)=>{
	// console.log(req.body.text);
	var todo = new Todo({text: req.body.text});

	todo.save().then((doc)=>{
		res.send(doc);
		console.log('saved new todo', todo.text);
	},(e)=>{
		res.status(400).send(e);
	});
});


app.get('/todos', (req, res)=> {
	Todo.find().then((todos)=>{
		res.status(200).send({todos});
	}, (e) =>{
		res.status(400).send(e);
	});
});



app.get('/todos/:id', (req, res)=> {
	var id = req.params.id;

	if(!ObjectId.isValid(id)){
		return res.status(404).send();
	}
		
	Todo.findById(id).then((todo)=>{
		if(!todo){
			return res.status(404).send();
		}	
		res.send({todo});
	});

},(e)=>{
	res.status(400).send(e);
});


app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	if(!ObjectId.isValid(id)){
		return res.status(404).send();
	}
		Todo.findByIdAndRemove({_id: id}).then((todo) => {
		if(!todo){
			return res.status(404).send();
		}
		res.status(200).send({todo});
		console.log('removed:', todo);
	}, (e) => {
		res.status(400).send()
	});
});


var server = app.listen(PORT, ()=>{
	console.log(`App listening on Port: ${PORT}`)
});


module.exports = {app};
