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
	})

})


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
			res.status(404).send();
		}		
		if(todo){
			res.send({todo});
		}
	});

},(e)=>{

	res.status(400).send(e);

})


var server = app.listen(PORT, ()=>{
	console.log(`App listening on Port: ${PORT}`)
})


module.exports = {app};




// var newTodo = new Todo({
// 	text: "cook dinner"
// });

// newTodo.save().then((doc)=>{
// 	console.log('saved todo', doc);		
// 	},(e)=>{
// 	console.log("unable to save todo");
// });






// // var newUser = new User({
// // 	email: "dmcghee@alliance.com"
// // });

// // newUser.save().then((doc)=> {
// // 	console.log('saved User\n', JSON.stringify(doc, undefined, 2));
// // },(e)=>{
// // 	console.log("couldn't save user", e);
// // });
