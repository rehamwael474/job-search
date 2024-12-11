import joi from 'joi'
import {generalField} from '../../middleware/validation.js'

export const signupVal = joi.object({
    firstName: generalField.firstName.required(),
    lastName: generalField.lastName.required(),
    username:generalField.username.required(),
    email:generalField.email.required(),
    recoveryEmail:generalField.recoveryEmail,
    password:generalField.password.required(),
    cPassword:generalField.cPassword.required(),
    DOB:generalField.DOB,
    phone:generalField.phone.required(),
    role:generalField.role,
    status:generalField.status,
})

export const loginVal = joi.object({
    phone:generalField.phone.when('email',{
        is:joi.exist(),
        then: joi.optional(),
        otherwise: joi.required()
    }),
    email:generalField.email.required(),
    password:generalField.password.required(),
   
})

export const updateAccountVal = joi.object({
    email:generalField.email.required() ,
    phone:generalField.phone.required(),
    recoveryEmail:generalField.recoveryEmail,
    DOB:generalField.DOB,
    firstName: generalField.firstName.required(),
    lastName: generalField.lastName.required(),
    userId:generalField.objectId.required()
    //id:generalField.id.required()
})

export const updatePasswordVal = joi.object({
    email:generalField.email.required(),
    oldpassword: generalField.password.required(),
    newPassword: generalField.password.required(),
})