// const expect = require('expect');
// const request = require('supertest');

// const {app} = require("./../server");
// const {Todo} = require('./../models/todo');

// beforeEach((done)=>{
// 	Todo.remove({}).then(() => done());	
// });


// describe('POST /todos', ()=>{

// 	it('should create a new todo', (done)=>{
// 		var text = 'est';

// 		request(app)
// 		.post('/todos')
// 		.send({text})
// 		.expect(200)
// 		.expect((res)=>{
// 			expect(res.body.text).toBe(text);
// 		})
// 		.end((err, res)=>{
// 			if(err){
// 				return done(err);
// 			}
// 			Todo.find().then((todos)=>{
// 				expect(todos.length).toBe(1);
// 				expect(todos[0].text).toBe(text);
// 				done();
// 			}).catch((e)=> done(e));
// 		});	
// 	});

// 	// post to same url 
// 	// send as empty object - will fail because can't save models
// 	// don't need to make assumption on body
// 	// use format above callback to end length must be 0. 

// 	it("should not create a todo with an invalid body type", (done)=>{
		


// 		request(app)
// 		.post("/todos")
// 		.send({})
// 		.expect(400)
// 		.end((err, res)=>{
// 			if(err){
// 				return done(err);
// 			}

// 			Todo.find().then((todos)=>{
// 				expect(todos.length).toBe(0);
// 				done();
// 			}).catch((e)=>done(e));


// 		});


// 	});

// });


const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done());
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

        Todo.find().then((todos) => {
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
  	.expect((res)=>{
  		expect(res.body.text).toBe();
  	})
  	.end((err, res)=>{
  		if(err){
  			return done(err);
  		}
  		Todo.find().then((todos)=>{
  			expect(todos.length).toBe(0);
  			done();
  		}).catch((e) => done(e));
  	});
  });// ends it
});



