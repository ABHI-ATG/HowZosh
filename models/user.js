const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const user=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isOnline:{
        type:Number,
        default:0
    }
});

user.pre('save',async function(next){
    if(this.isModified('password')){
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
    }
    next();
})

user.methods.matchPassword=async function(password){
    const data=await bcrypt.compare(password,this.password)
    return data;
}

user.methods.generateToken=async function(){
    try {   
        const token=jwt.sign({_id:this._id},process.env.SECRET_KEY)
        return token;
    } catch (error) {
        console.log(error);
    }
}

module.exports=mongoose.model('User',user)