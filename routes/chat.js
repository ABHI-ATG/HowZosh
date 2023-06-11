const app=require('express')();
const {search,create,send,dashboard,deleteNotification}=require('../contoller/chatController')
const authenticate=require('../middleware/authenticate')

app.get('/dashboard',dashboard);
app.get('/search',authenticate,search);
app.post('/create',authenticate,create);
app.post('/send',authenticate,send);
app.post('/deleteNotification',authenticate,deleteNotification);


module.exports=app;