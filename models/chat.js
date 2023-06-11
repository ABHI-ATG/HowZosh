const mongoose=require('mongoose')

const Chat=mongoose.Schema({
    latest:{
        type:String,
        require:true,
        default:"Say Hi !!"
    },
    user1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    user2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:[{
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        content:{
            type:String,
            trim:true
        }
    }],
    pending1:{
        type:Number,
        default:0
    },
    pending2:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model('Chat',Chat)