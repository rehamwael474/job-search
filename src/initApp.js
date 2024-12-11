import { globalErrorHandling } from "./middleware/asyncHandler.js"
import{userRouter,companyRouter,jobRouter}from "./index.js"


export const initApp =(app,express) => {
    // parse req
    app.use(express.json())
    // public folder
    app.use('/uploads',express.static('uploads'))

    // routing
    app.use('/user',userRouter)
    app.use('/company',companyRouter)
    app.use('/job',jobRouter)
    
    

    // globalErrorHandling
    app.use(globalErrorHandling)


}