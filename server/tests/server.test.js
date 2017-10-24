const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');



const todos = [{
	_id: new ObjectID(),
	text: 'first test todo'
},{
	_id: new ObjectID(),
	text: 'second test todo'
}]


beforeEach((done) => {
  Todo.remove({}).then(() => {
  return Todo.insertMany(todos);	
}).then(()=> done());
  
});

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
