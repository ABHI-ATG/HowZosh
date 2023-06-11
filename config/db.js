const mongoose=require('mongoose')

const connDb =async ()=>{
    try {
        const con=await mongoose.connect(process.env.MONGO_URI,{
        })
        console.log(`Db Connected ${con.connection.host}`)
    } catch (error) {
        console.log(`Db connect error : ${error}`)
    }
}

module.exports=connDb;