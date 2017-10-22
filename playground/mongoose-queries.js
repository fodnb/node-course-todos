const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

  // query user id load in user model  use user.findbyid()   3 cases // error/ was found and not found

let id = '59e68a23d0fd964244846386';


User.findById(id).then((user)=> {
	
	if(!user){
		return console.log('user not found'); 
	}

	console.log('id found', user);



}).catch((e)=>{
	console.log(e);
});
