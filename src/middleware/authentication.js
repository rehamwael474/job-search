import { User } from "../../db/index.js"
import { AppError } from "../utils/appError.js"
import { messages } from "../utils/constant/messages.js"
import { verifyToken } from "../utils/token.js"

export const isAuthenticated = () => {
    return async (req,res,next) => {
        // token
        const {token} = req.headers
        // decode token
        const payload = verifyToken({ token })
        if(payload.message){
            return next (new AppError(payload.message,401))

        }
        // check user exist
        const authUser = await User.findOne({_id: payload._id,status:{$ne:"online"}})
        if(!authUser){
            return next(new AppError(messages.user.notFound,404))
        }
        req.authUser = authUser
        next()
    }

}