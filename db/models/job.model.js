import pkg from 'joi';
import { model, Schema } from "mongoose";
import {  jobLocations, seniorityLevels, workingTimes } from "../../src/utils/constant/enums.js";

// schema
const jobSchema = new Schema({
jobTitle:{
    type:String,
    required: true,
    trim: true
  },
jobLocation:{
    type:String,
    enum: Object.values(jobLocations),
    default: jobLocations.ONSITE
   
  },
workingTime:{  
    type:String,
    enum: Object.values(workingTimes),
    default: workingTimes.FULL_TIME
    },
seniorityLevel:{
    type:String,
    enum: Object.values(seniorityLevels),
    default: seniorityLevels.SENIOR
},
jobDescription:{
    type:String,
    required: true
   },
technicalSkills:[{
    type:String,
    required: true
}],

softSkills:[{
    type:String,
    required: true
}],

company: {
    type: Schema.Types.ObjectId,
    ref: 'Company', 
    required: true,
},
createdBy:{
    type:Schema.Types.ObjectId,
    ref: "User",
    required:true
},
updatedBy:{
    type:Schema.Types.ObjectId,
    ref: "Company_HR",
    required:true
}

},{timestamps:true})

//model
export const Job = model('Job',jobSchema)