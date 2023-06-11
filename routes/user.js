const app=require('express')();
const {signup,signin, logout}=require('../contoller/userController')
const authenticate=require('../middleware/authenticate')

app.post('/signup',signup)
app.post('/signin',signin)
app.get('/signout',authenticate,logout)

module.exports=app;