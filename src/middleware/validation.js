import joi from "joi"
import { AppError } from "../utils/appError.js" 
import { jobLocations, roles, seniorityLevels, statuses, workingTimes } from "../utils/constant/enums.js"


const parseArray = (value,helper) => {
    let data = JSON.parse(value)
    let schema = joi.array().items(joi.string())
    const  { error } = schema.validate(data)
    if (error){
        return helper(error.details)
    }
    return true
}


export const generalField = {
    //user
    firstName:joi.string(),
    lastName:joi.string(),
    username: joi.string().required(),
    email:joi.string(),
    recoveryEmail:joi.string(),
    DOB:joi.string,
    password:joi.string().pattern(new RegExp(/^(?=.*[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
    cPassword:joi.string().valid(joi.ref('password')),
    phone:joi.string().pattern(new RegExp(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)),
    role:joi.string().valid(...Object.values(roles)),
    status:joi.string().valid(...Object.values(statuses)),
   
   
    //job
    jobTitle:joi.string(),
    jobLocation:joi.string().valid(...Object.values(jobLocations)),
    workingTime: joi.string().valid(...Object.values(workingTimes)), 
    seniorityLevel: joi.string().valid(...Object.values(seniorityLevels)),
    jobDescription:joi.string(),
    technicalSkills:joi.string(),
    softSkills:joi.string(),
    createdBy:joi.string(),
    updatedBy:joi.string(),
    //company
    companyName:joi.string(),
    description:joi.string().max(2000),
    industry:joi.string(),
    companyEmail:joi.string(),
    companyHR:joi.string(),
    address:joi.string(),
    objectId: joi.string().pattern(/^[0-9a-fA-F]{24}$/)

}



export const isValid = (schema) => {
    return(req,res,next)=>{
        let data = {...req.body,...req.params,...req.query}
       const {error} = schema.validate(data,{abortEarly: false})
       if (error){
        let errArr = []
        error.details.forEach((err)=>{errArr.push(err.message)})
        return next(new AppError(errArr,400))
       }
       next()
    }
}