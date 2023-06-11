const User=require('../models/user')
const Chat=require('../models/chat')

const dashboard = async (req,res)=>{
    try {
        const data=await Chat.find({
            $or:[{user1:req.id},{user2:req.id}]
        }).populate('user1','name').populate('user2','name')
        console.log(data);
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send("Eror in loading Dashboard")
    }
}


const search = async (req,res)=>{
    try {
        const alreadyExist=await Chat.find({
            $or:[{user1:req.id},{user2:req.id}]
        },{user1:1,user2:1,_id:0});
        const arrayId=alreadyExist.map((obj)=>{
            if(!obj.user1.equals(req.id)){
                return obj.user1;
            }
            return obj.user2;
        })
        arrayId.push(req.id);
        console.log(arrayId);
        const data=await User.find({
            name:{$regex:`${req.query.name}`,$options:"i"},
            $nor:arrayId.map(obj=>(
                {_id:obj}
            ))
        },{name:1});
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send("Eror in serch")
    }
    
}

const create=async(req,res)=>{
    try {
        const {sender,reciever}=req.body;
        const data=await Chat.findOne({$or:[{user1:sender,user2:reciever},{user2:sender,user1:reciever}]})
        if(data){
            return res.status(200).send(data)
        }else{
            const data=await Chat.create({
                user1:sender,
                user2:reciever
            });
            if(data){
                return res.status(200).send(data)
            }else{
                return res.status(400).send("Try Again Later")        
            }
        }
        
    } catch (error) {
        res.status(400).send("Error in create")        
    }
}

const send=async(req,res)=>{
    try {
        const {chatId,senderId,message}=req.body;
        const data=await Chat.findOne({_id:chatId})
        if(data){
            const info={sender:senderId,content:message};
            data.message.push(info)
            await data.save();
            const truncMessage=message.substring(0,20)+"...";
            console.log(data.user1);
            console.log(req.id);
            if(data.user1.equals(req.id)){
                console.log('same');
                await Chat.updateOne({_id:chatId},{ $set: {latest: truncMessage},$inc:{pending2:1}})
            }else{
                console.log('differenct');
                await Chat.updateOne({_id:chatId},{ $set: {latest: truncMessage},$inc:{pending1:1}})
            }
            res.status(200).send('Chat added Successfully')
        }else{
            res.status(400).send("Chat Does not Exist")
        }
    } catch (error) {
        res.status(400).send("Error in send")        
    }
}

const deleteNotification=async (req,res)=>{
    try {
        const {chatId}=req.body;
        const data=await Chat.findOne({_id:chatId})
        if(data){
            await Chat.updateOne({_id:chatId},{ $set: {pending1: 0,pending2:0}})
            res.status(200).send('Notification deleted successfully')
        }else{
            res.status(400).send("Chat Does not Exist")
        }
    } catch (error) {
        res.status(401).send('error in deleting notification')
    }
}

module.exports={search,create,send,dashboard,deleteNotification}