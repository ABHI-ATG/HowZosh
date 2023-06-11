const jwt=require('jsonwebtoken');
const User=require('../models/user')

const authenticate=async (req,res,next)=>{
    // const 
    try {
        const token=req.cookies.jwt;
        const verify=jwt.verify(token,process.env.SECRET_KEY);
        if(!verify){
            return res.status(400).send("Login First")
        }
        const userExist=await User.findOne({_id:verify._id});
        if(!userExist){
            return res.status(400).send("User does not Exist")
        }
        req.token=token;
        req.user=userExist;
        req.id=userExist._id;
        next();
    } catch (error) {
        res.status(401).send("Unauthorised")
    }
}

module.exports=authenticate;