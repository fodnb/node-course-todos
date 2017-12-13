const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {User} = require('./../models/user');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const {populateTodos, populateUsers, users, todos} = require('./seed/seed');

// const todos = [{
// 	_id: new ObjectID(),
// 	text: 'first test todo'
// },{
// 	_id: new ObjectID(),
// 	text: 'second test todo',
// 	completed: true,
// 	completedAt: 513
// }]

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        } 

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });



  it('should not add todo with incorrect body', (done)=>{

  	request(app)
  	.post('/todos')
  	.expect(400)
  	.send({})
  	.end((err, res)=>{
  		if(err){
  			return done(err);
  		}
  		Todo.find().then((todos)=>{
  			expect(todos.length).toBe(2);
  			done();
  		}).catch((e) => done(e));
  	});
  });// ends it
});

///////////   GET ROUTES   /////////////////////////////////////////////////////////////////////////

describe('GET /todos', ()=>{
	it('should get all todos', (done)=> {
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res)=>{
			expect(res.body.todos.length).toBe(2);
		})
		.end(done);
	});
});



describe('get /todos/:id', ()=>{
	it('should return todo doc', (done)=>{
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done);
	});

	it('should return a 404 if todo is not found', (done)=>{
		//make sure you get a 404 back
		const testObjectID = new ObjectID().toHexString();

		request(app)
		.get(`/todos/${testObjectID}`)
		.expect(404)
		.end(done);
	});

	it('should return a 404 for non ObjectID', (done)=>{
		// /todos/123
		const failId = "59efaa62efe4942df00dc75d";

		request(app)
		.get(`/todos/${failId}`)
		.expect(404)
		.end(done);
	});
});


describe('DELETE /todos/:id', ()=>{
	it('should delete todo', (done)=>{
		var hexId = todos[1]._id.toHexString();
		request(app)
		.delete(`/todos/${hexId}`)
		.expect(200)
		.expect((res)=>{
			expect(res.body.todo._id).toBe(hexId);
		})
		.end((err, res)=>{
			if(err){
				return done(err);
			}

			Todo.findById(hexId).then((todo)=>{
				expect(todo).toNotExist;
				done();
			}).catch((e)=> done(e));
	});
	});

	it('should return 404 if todo not found', (done) => {
		var testObjectID = new ObjectID();

		request(app)
		.delete(`/todos/${testObjectID}`)
		.expect(404)
		.end(done);
	});	

	it('should return 404 if ObjectID is invalid', (done)=>{
		const failId = "59efaa62efe4942df00dc75d";

		request(app)
		.delete(`/todos/${failId}`)
		.expect(404)
		.end(done);

	});
});


describe('PATCH /todos/:id', ()=>{

	it('should update the todo', (done)=> {
		var text = 'updated text';
		var completed = true;
		request(app)
			.patch(`/todos/${todos[0]._id}`)
			.send({text, completed})
			.expect(200)
			.expect((res)=>{
				expect(res.body.todo.text)
				.toBe(text);
				expect(res.body.todo.completed)
				.toBe(true);
				expect(typeof(res.body.todo.completedAt))
				.toBe(typeof(10));
			})
			.end(done);


	});

	it('should clear completedAt when todo is not completed', (done)=> {
		var text = 'changing text';
		var completed = false;	

		request(app)
			.patch(`/todos/${todos[1]._id}`)
			.send({text, completed})
			.expect(200)
			.expect((res) => {

				Todo.findById(todos[1]._id).then((todo)=>{
					expect(res.body.todo.text).toBe(text);
					expect(res.body.todo.completed).toBe(false);
					expect(res.body.todo.completedAt).toNotExist	;
					
				})
			})
			.end(done);

	});

});

describe('Post /users/login', ()=>{

		it('should login user and return auth token', (done)=> {
				request(app)
				.post('/users/login')
				.send({
					email: users[1].email,
					password: users[1].password
				})
				.expect(200)
				.expect((res)=>{
					expect(res.headers['x-auth']).toExist;
				})
				.end((err,res)=>{
					if(err){
						return done(err);
					}
					User.findById(users[1]._id).then((user)=>{
						expect(user.tokens[0].token).toEqual(res.headers['x-auth']);
						expect(user.tokens[0].access).toEqual('auth');
						done();
					}).catch((e)=> done(e));	

				});

		});

		it('should reject invalid login',(done)=>{
			// 400 token to not exist and tokens array to be 0

			request(app)
			.post('/users/login')
			.send({password: 'password'})
			.expect(400)
			.expect((res)=>{
				expect(res.headers['x-auth']).toNotExist;
				})
			.end((err,res)=>{

				User.findOne({password: res.password}).then((user)=>{
					expect(user).toNotExist;
					done();
				}).catch((e)=> done(e));	


			});

});
});

describe('DELETE users/me/token', () => {

		it('should remove auth token on logout', (done)=>{

		request(app)
		.delete('/users/me/token')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)	
		.end((err, res)=>{
			if(err){
				return done(err);
			}
			// console.log(user[0]._id);
			User.findById(users[0]._id).then((user)=>{
				expect(user.tokens.length).toBe(0);
				done();
			}).catch((e) => done(e));
		})			


		});


});


