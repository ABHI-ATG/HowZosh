const express = require("express");
const app = express();

const dotenv=require('dotenv')
dotenv.config();

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors=require('cors')
app.use(cors())
const cookieParser=require('cookie-parser');
app.use(cookieParser())

require('./config/db')()
const port = process.env.PORT||5000

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://funny-halva-a4a187.netlify.app');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(express.json());

// routes
const user=require('./routes/user')
const chat=require('./routes/chat')

app.use('/api/user',user)
app.use('/api/chat',chat)


// deployment
// const path=require('path')
// const __dirname1=path.resolve();

// if(process.env.NODE_ENV==='production'){

//   app.use(express.static(path.join(__dirname1,'/frontend/build')))

//   app.get('*',(req,res)=>{
//     console.log(path.resolve(__dirname1,'/frontend','build','index.html'));
//     res.sendFile(path.resolve(__dirname1,'/frontend','build','index.html'))
//   })

// }else{
//   app.get('/',(req,res)=>res.end('Api running Successfully'))
// }


// 

app.use(notFound);
app.use(errorHandler);

const server=app.listen(port,()=>console.log(`Port running at ${port}`))


// socket programming

const io=require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:"https://funny-halva-a4a187.netlify.app"
  }
})

io.on('connection',(socket)=>{
  var userId;
  console.log('a user connected')
  socket.on('setup',(id)=>{
    userId=id;
    console.log(`connected ${id}`)
    socket.join(id);
  })

  socket.on('send',(data)=>{
    socket.to(data.reciever).emit('recieved',data);
  })

  socket.on('disconnect',()=>{
    socket.leave(userId);
    console.log('user disconnect')
  })
})