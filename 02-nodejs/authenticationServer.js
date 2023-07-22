/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  
  
  
  - For any other route not defined in the server return 404
  
  Testing the server - run `npm run test-authenticationServer` command in terminal
  */
 
 const express = require("express")
 const PORT = 3000;
 const app = express();
 const bodyParser = require('body-parser');
 
 app.use(bodyParser.json());
 // write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
 // 1. POST /signup - User Signup
 //   Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
 //   Request Body: JSON object with username, password, firstName and lastName fields.
 //   Response: 201 Created if successful, or 400 Bad Request if the username already exists.
 //   Example: POST http://localhost:3000/signup
 
 let array = [];

function signUpHandler(req, res) {

  let UserId = Math.floor(Math.random() * 10000);
  let signUpObject = {
    "username": req.body.username,
    "password": req.body.password,
    "firstName": req.body.firstName,
    "lastName": req.body.lastName,
    "id": UserId
  }
  console.log(UserId);
  console.log(signUpObject);UserId
  let userCreated = false;
  for(let i = 0; i<array.length; i++){
    if(array[i].username===signUpObject.username){
      userCreated = true;
      break;
    }
  }
  if(userCreated){
    res.status(400).send("User Already Exists");
  }
  else {
    array.push(signUpObject);
    res.status(201).send("User Created Successfully");
  }
  
}
app.post('/signup', signUpHandler);
// 2. POST /login - User Login
// Description: Gets user back their details like firstname, lastname and id
// Request Body: JSON object with username and password fields.
// Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
//   Example: POST http://localhost:3000/login
function loginHandler(req, res){
  let user= req.body.username;
  let flag = false;
  for(let i = 0; i<array.length; i++){
    if(array[i].username === user){
      let returningObject = {
        "firstName" : array[i].firstName,
        "lastName" : array[i].lastName,
        "id" : array[i].id
      }
      res.status(200).json(returningObject);
      flag = true; 
    }
  }
  if(flag === false)
    res.status(401).send("Credentials are invalid");
}
app.post('/login', loginHandler);
// 3. GET /data - Fetch all user's names and ids from the server (Protected route)
// Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
// The users username and password should be fetched from the headers and checked before the array is returned
// Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
// Example: GET http://localhost:3000/data
app.get('/data', getDataHandler);
function getDataHandler(req, res){
  let username = req.headers.username;
  let password = req.headers.password;
  let userExists = false;
  for(let i=0; i<array.length; i++){
    if(array[i].username === username && array[i].password === password){
      userExists=true;
      break;
    }
  }
  let users = [];
  for(let i = 0; i<array.length; i++){
    users.push({
      "username" : array[i].username,
      "firstname" : array[i].firstName,
      "lastname" : array[i].lastName
    })      
  }
  if(userExists){
    res.status(200).json(users);
  }
  else
  {
    res.status(401).send("Unauthorised");
  }
}
app.listen(PORT, () => {
  console.log(`this app is running on ${PORT}`);
})

module.exports = app;
