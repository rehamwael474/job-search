import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { deleteAccount, forgetPassword, getAccountsByRecoveryEmail, getProfileData, getUserAccountData, login, resetPassword, signup, updateAccount, updatePassword, verifyAccount } from "./user.controller.js";
import { isValid } from "../../middleware/validation.js";
import { loginVal, signupVal, updateAccountVal } from "./user.validation.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";


const userRouter = Router()

// signup 
userRouter.post('/signup',
    isValid(signupVal),
    asyncHandler(signup)
)
// verify account
userRouter.get('/verify/:token',asyncHandler(verifyAccount))
// login
userRouter.post('/login',
    isValid(loginVal),
    asyncHandler(login)
)

// update account
userRouter.put('/updateAccount/:userId',
    isAuthenticated(),
    isAuthourized([roles.USER]),
    isValid(updateAccountVal),
    asyncHandler(updateAccount))

    // delete account
userRouter.delete('/delete/:userId',
    isAuthenticated(),
    isAuthourized([roles.USER]),
    asyncHandler(deleteAccount))

    // get user account data
userRouter.get('/',
    isAuthenticated(),
    isAuthourized([roles.USER]),
    asyncHandler(getUserAccountData))

//getProfileData
userRouter.get('/getProfileData/:userId',
    asyncHandler(getProfileData))

//getAccountsByRecoveryEmail
userRouter.get('/getAccountsByRecoveryEmail',
    asyncHandler(getAccountsByRecoveryEmail))
    //updatePassword
userRouter.put("/updatePassword/:userId",
    isAuthenticated(),
    isAuthourized([roles.USER]),
    asyncHandler(updatePassword))

    //forgetPassword
userRouter.put("/forgetPassword",
    isAuthenticated(),
    isAuthourized([roles.USER]),
    asyncHandler(forgetPassword))

userRouter.post('/resetPassword',
    isValid(resetPassValidation),
    asyncHandler(resetPassword)
        );
export default userRouter