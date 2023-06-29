const bcrypt =require('bcryptjs')
const jwt=require('jsonwebtoken')
const saltRound =10;



const hashPassword = async(password)=>{
    let salt =await bcrypt.genSalt(saltRound)

    let hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword

}

const hashCompare = async(password,hashedPassword)=>{
  
   const result= await bcrypt.compare(password,hashedPassword)
   console.log("comparing password",result)
   return result
}

const createToken = async(payload)=>{
    try {
    // console.log("inside create token",payload)
    // console.log("secret key", process.env.secretkey)
    let token=  jwt.sign(payload,process.env.secretkey,{expiresIn:'1h'})
    // console.log("out token:",token)
    return token
    } catch (err){
        console.log(err)
    }
}

// const validate= async(req,res,next)=>{
//     console.log(req.headers.authorization)
//     if(req.headers.authorization){
//         let token= req.headers.authorization.split(" ")[1]
//         console.log(token)
//         let data=  await jwt.decode(token)
//         console.log(data)
//         if(Math.floor((+new Date())/1000)< data.exp){
//            return next()
//         }else{
//             res.status(402).send({
//                 message:"Token Expired"
//             })
//         }

//         return next()
//     }
//     else{
//        return res.status(400).send({
//             message:'Token not found' 
//         })
//     }
// }

// const roleAdminGuard = async(req,res,next)=>{
//     if(req.headers.authorization){
//         let token= req.headers.authorization.split(" ")[1]
//         console.log(token)
//         let data=  await jwt.decode(token)
//         console.log(data)
//         if(data.role==='Admin'&& data.role==='Managers'&& data.role==='Employee'){
//             next()
//         }else{
//             res.status(402).send({
//                 message:"Only Admins,Mangers,Employees are Allowed"
//             })
//         }

//         next()
//     }
//     else{    
//         res.status(400).send({
//             message:'Token not found' 
//         })
//     }

// }


// const verify = async (req, res, next) => {
//     try {
//         // Get the token from the request headers
//         const token = req.headers.authorization.split(' ')[1];
//         console.log(token)

//     // const decodedToken = jwt.verify(token, process.env.secretKey);
//     // console.log(decodedToken)
    
//         // Verify and decode the token
//         const decodedToken = await jwt.decode(token,process.env.secretKey);
    
//         // Set the user information in req.user
//         req.user = decodedToken;
    
//         next();
//       } catch (error) {
//         return res.status(401).send({ message: 'Unauthorized' });
//       }
//     }
const verifyToken = (req, res, next) => {
  const token =req.headers['authorization'].split(" ")[1];
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.secretkey); // Replace 'your-secret-key' with your actual secret key
    console.log(decoded)
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};
  



module.exports={hashPassword,hashCompare,createToken,verifyToken}