import fs from 'fs'
import path from 'path'
import multer, { diskStorage } from "multer"
import { nanoid } from 'nanoid';
import { AppError } from './appError.js'
import { fileValidation } from './multer.js'

const fileValidation = {
    image:['image/png','image/jpeg'],
    file: ['application/pdf'],
    
}
export const cloudUploads = ({allowTypes =fileValidation.file})=>{
    const storage = diskStorage({})
    const fileFilter = (req,file,cb) => {
        if(allowTypes.includes(file.mimetype)){
            return cb(null,true)
        }
      
        cb(new AppError('invalid file format',400),false)
    }
    return multer({storage, fileFilter})
}