const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');


const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: 'dan@example.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, "abc").toString()
	}]
},
{
	_id: userTwoId,
	email: 'una@example.com',
	password: 'userTwoPass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, "abc").toString()
	}]
}
]


const todos = [{
	_id: new ObjectID(),
	text: 'first test todo',
	_creator: userOneId
},{
	_id: new ObjectID(),
	text: 'second test todo',
	_creator: userOneId,
	completed: true,
	completedAt: 513,
	_creater: userTwoId

}];



const populateTodos = (done) => {
  Todo.remove({}).then(() => {
  return Todo.insertMany(todos);	
}).then(()=> done());
  
};

const populateUsers = (done) => {		
	User.remove({}).then(()=>{
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])

	}).then(() => { 
		done();
	});
};


module.exports = {populateTodos, todos, populateUsers, users};