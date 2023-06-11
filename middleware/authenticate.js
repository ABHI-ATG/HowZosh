const jwt=require('jsonwebtoken');
const User=require('../models/user')

const authenticate=async (req,res,next)=>{
    // const 
    try {
        console.log("authenticate");
        console.log(req.body);
        console.log(req.headers.authorization);
        const token=req.headers.authorization;
        console.log(token);
        const tokenValue=token;
        if(token.startsWith('Bearer ')){
            tokenValue=token.split(' ')[1];
        }
        console.log(tokenValue);
        const verify=jwt.verify(tokenValue,process.env.SECRET_KEY);
        console.log(verify)
        if(!verify){
            return res.status(400).send("Login First")
        }
        const userExist=await User.findOne({_id:verify._id});
        if(!userExist){
            return res.status(400).send("User does not Exist")
        }
        console.log(userExist);
        req.token=token;
        req.user=userExist;
        req.id=userExist._id;
        next();
    } catch (error) {
        res.status(401).send("Unauthorised")
    }
}

module.exports=authenticate;