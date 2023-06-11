const User=require('../models/user')

const signup=async (req,res)=>{
    try {
        const {name , email, password}=req.body;
        
        if(!name || !email || !password){
            return res.status(400).send('Enter all details');
        }
        const userExist=await User.findOne({email})
        if(userExist){
            return res.status(400).send('User already exist');
        }
        const data=await User.create({name,email,password})
        const token=await data.generateToken();
        res.cookie('jwt',token,{
            expires:new Date(Date.now()+10000000000)
        })
        res.status(200).json({
            token:token,
            id:data._id,
            name:data.name
        })
    } catch (error) {
        return res.status(404).send(error);
    }
}

const signin=async (req,res)=>{
    try {
        const {email , password}=req.body;
        
        if(!email || !password){
            return res.status(400).send('Enter all details');
        }

        const userExist=await User.findOne({email})
        if(userExist){
            const isMatch=await userExist.matchPassword(password);
            if(isMatch){
                const token=await userExist.generateToken();
                res.cookie('jwt',token,{
                    expires:new Date(Date.now()+10000000000)
                })
                res.status(200).json({
                    token:token,
                    id:userExist._id,
                    name:userExist.name
                })
            }else{
                return res.status(400).send('User does not exist');
            }
        }else{  
            return res.status(400).send('User does not exist');
        }
    } catch (error) {
        return res.status(404).send(error);
    }
}


const logout=async (req,res)=>{
    try {
        console.log("signout");
        console.log(req.cookies.jwt);
        res.clearCookie('jwt');
        res.status(200).send("Logout Successfully")
    } catch (error) {
        res.status(400).send("Try Again Later"+error)
    }    
}

module.exports={signup,signin,logout}