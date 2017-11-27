require('./config/config');
const {mongoose} = require("./db/mongoose");
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const ObjectId = mongoose.Types.ObjectId;

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;

			
app.use(bodyParser.json());

// CRUD create read update delete

// for /todo's to create new todo
app.post("/todos", (req, res)=>{
	// console.log(req.body.text);
	var todo = new Todo({text: req.body.text});

	todo.save().then((doc)=>{
		res.send(doc);
		// console.log('saved new todo', todo.text);
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
		// console.log('removed:', todo);
	}, (e) => {
		res.status(400).send()
	});
});



app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;

	var body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectId.isValid(id)){
		return res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed){

		body.completedAt = new Date().getTime();

	} else {

		body.completed = false;
		body.completedAt = null;
		
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {

		if(!todo){
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e)=> res.status(400).send());


});

// POST /users
app.post('/users', (req, res) => {
	// console.log(req.body);
	var body = _.pick(req.body, ['email', 'password']);

	var user = new User({email: body.email, password: body.password});
		
	user.save().then(()=> {

		return user.generateAuthToken();
	
	}).then((token)=>{

		res.status(200).header("x-auth", token).send(user);

	}).catch((e)=> {
		res.status(400).send()
	});	
});


app.post('/users/login', (req, res) => {
		var body = _.pick(req.body, ['email', 'password']);


		User.findByCredentials(body.email, body.password).then((user)=>{
			return user.generateAuthToken().then((token)=>{
					 res.header('x-auth', token).send(user);

			})
		
			// console.log(user);	
		}).catch((e)=>{
			res.status(400).send();
		});
});

app.get('/users/me', authenticate, (req, res)=> {
	res.send(req.user);	
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(()=>{
		res.status(200).send();
	}, ()=> {
		res.status(400).send();
	})
})



var server = app.listen(PORT, ()=>{
	console.log(`App listening on Port: ${PORT}`)
});


module.exports = {app};
