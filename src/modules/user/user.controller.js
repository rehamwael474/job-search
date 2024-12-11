import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { customAlphabet } from 'nanoid'
import { User } from "../../../db/index.js"
import { sendEmail } from '../../utils/sendEmail.js'
import { AppError } from '../../utils/appError.js'
import { messages } from '../../utils/constant/messages.js'
import { generateToken, verifyToken } from '../../utils/token.js'



// signup
export const signup = async (req,res,next)=>{
  //get data from req
    const {firstName,lastName,username,email,recoveryEmail,password,phone} = req.body
   // check existence
    const userExist =await User.findOne({ $or:[{email},{phone}]})
    if(userExist) {

    next(new AppError(messages.user.alreadyExist,409))
  }
  // prepare data
    const hashPassword = bcrypt.hashSync(password, 8)
    const user = new User({
        firstName,
        lastName,
        username,
        email,
        recoveryEmail,
        password:hashPassword,
        phone
        
    
    })
    // add to db
    const createdUser = await user.save()
    if(!createdUser){
      return next (new AppError(messages.user.failToCreate,500))
    }
    // generate token
   const token = generateToken({payload:{email}})
     //send email
    await sendEmail({to:email,subject:"verify your account",html:`<p>click on link to verify account <a href = "${req.protocol}://${req.headers.host}/user/verify/${token}">link</a></p>`})
    // send response
    return res.status(201).json({
      Message:messages.user.createdSuccessfully,
      success:true,
      data:createdUser})
  }

// verify account
export const verifyAccount = async(req,res,next)=>{
   // get data from req
  const {token} = req.params
  const payload = verifyToken({token})
  await User.findOneAndUpdate({email: payload.email,status:"offline"},{status: "online"})
  return res.status(200).json({message:messages.user.verified,success:true})
}

// login
export const login = async (req,res,next)=>{
 // get data from req  
const {email,phone,recoveryEmail,password}= req.body
// check existence
const userExist = await User.findOne({$or: [{email},{phone},{recoveryEmail},{password}],status:"online"})
if (!userExist){
    next(new AppError(messages.user.invalidCredentials,400))

}
//check password
const match = bcrypt.compareSync(password,userExist.password)
if (!match){
    next(new AppError(messages.user.invalidCredentials,400))
}
// generate token
const token = generateToken({payload:{_id:userExist._id,email}})
// send response
return res.status(200).json({Message:messages.user.createdSuccessfully,
  success:true,
  token})

}

// update account
export const updateAccount = async (req, res, next) => {
  // Get data from request
  const { email, phone, recoveryEmail, DOB, lastName, firstName } = req.body;
  const {userId} =req.params

  // Check user exists
  const user = await User.findById(userId);
  if (!user) {
      return next(new AppError(messages.user.notFound, 404));
  }

  // Check existing email or mobile number
  if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists.id !== userId) {
          return next(new AppError(messages.user.alreadyExist, 409));
      }
      user.email = email;
  }

  if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists && phoneExists.id !== userId) {
          return next(new AppError(messages.user.alreadyExist, 409));
      }
      user.phone = phone;
  }

  // prepare data
  user.email = email;
  user.phone = phone;
  user.recoveryEmail = recoveryEmail;
  user.DOB = DOB;
  user.lastName = lastName;
  user.firstName = firstName;

  // add to db
  const updatedUser = await user.save();
  if(!updatedUser){
    return next (new AppError(messages.user.failToUpdate,500))
  }
  // send response
  return res.status(200).json({Message:messages.user.updatedSuccessfully, success: true, data: updatedUser });
};

// delete account
export const deleteAccount = async (req, res, next) => {
  // get data from req
  const {userId} =req.params
// check existence
  const userExist = await User.findById(userId);
  if (!userExist) {
      return next(new AppError(messages.user.notFound, 404));
  }
  // delete user from db
  await User.findByIdAndDelete(userId);

  return res.status(200).json({ Message:messages.user.deletedSuccessfuly, success:true});
};

// get user account data
export const getUserAccountData = async (req, res, next) => {

  return res.status(200).json({Message:messages.createdSuccessfully, success: true, data:req.authUser });
};

// get profile data for another user
export const getProfileData = async (req, res, next) => {
// get data from req
  const { userId } = req.params;
  // check existence
  const userAccount = await User.findById(userId);
  if (!userAccount) {
      return next(new AppError(messages.user.notFound, 404));
  }

  return res.status(200).json({Message:messages.user.createdSuccessfully, success: true, data: userAccount });
};

//update password
export const updatePassword = async (req,res,next)=>{
    // get data from req
  const {email, oldPassword, newPassword} = req.body
   // check existanse
  const userExist = await User.findOne({email})
  if(!userExist){
    return next(new AppError(messages.user.invalidCredentials , 400))
}
 // check password
 const match = bcrypt.compareSync(oldPassword , userExist.password)
 if(!match){
     return next(new AppError(messages.user.invalidCredentials , 400))
 }  
 const hashedPassword = bcrypt.hashSync(newPassword, 9);
 // Update password
 userExist.password = hashedPassword;
 await userExist.save();
      const updatedPassword = await User.findOneAndUpdate({email},{password:newPassword})
      if(!updatedPassword){
          next(new AppError(messages.user.invalidCredentials ,400))
      }
  return res.status(200).json({message:messages.user.updatedSuccessfully,
      success:true,
      data:updatedPassword
  })
  }


//const generateOTP = customAlphabet("0123456789",5) 

// forget password
export const forgetPassword = async (req, res, next) => {
  // get data from req
  const { email } = req.body;
  // check existence
  const user = await User.findOne({ email });
  if (!user) {
      return next(new AppError(messages.user.notFound, 404));
  }

  // Generate OTP
  const otp = generateOTP() // 83974
  const otpExpired = new Date();
  // hash OTP
  const hashedOTP = bcrypt.hashSync(otp, 9);
  user.otp = hashedOTP;
  user.otpExpired = otpExpired;
  await user.save();
  
  //send email
  await sendEmail({
    to:email,
    subject:"reset password",
    text:`your OTP is ${otp}`
  });
  
    
  return res.status(200).json({ message: 'OTP sent to your email', success: true });
};

// reset password
export const resetPassword = async(req,res,next)=>{
  const{email,otp,password} = req.body
  // check user
  const user = await User.findOne({ email });
  if (!user) {
      return next(new AppError(messages.user.notFound, 404));
  }
  password = bcrypt.hashSync(password , 9) 
  const resetPassword = await User.updateOne({email,otp,password})
  if(!resetPassword){
      next(new AppError("user not found or otp incorrect"))
  }
  return res.status(200).json({message:"Done",success:true,data:resetPass})

}


// get all accounts associated to a specific email
export const getAccountsByRecoveryEmail = async (req, res, next) => {
  // get data from req
  const { recoveryEmail } = req.body;
  const users = await User.find({ recoveryEmail });
  if (!users) {
      return next(new AppError(messages.user.notFound, 404));
  }

  return res.status(200).json({ success: true, data: users });
};