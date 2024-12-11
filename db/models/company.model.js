import pkg from 'joi';
const { required } = pkg;
import { model, Schema } from "mongoose";

// schema
const companySchema = new Schema({
companyName:{
    type:String,
    required: true,
    unique: true,
    lowercase: true,
    trim:true
  },
description:{
    type:String,
    required:true,
  },
industry:{  
    type:String,
    required: true,
    trim:true
    },
address:{
    type:String,
    required:true,
},
numberOfEmployees:{
    from:{
        type:String
    },
    to:{
        type:String
    },
   },
companyEmail:{
    type:String,
    required:true,
    unique:true,
    trim: true,
    lowercase:true
   },

companyHR:{
    type:Schema.Types.ObjectId,
    ref: "User",
    required:true 
},
job: [{
    type: Schema.Types.ObjectId,
    ref: 'Job', 

}],



},{timestamps:true})

//model
export const Company = model('Company',companySchema)