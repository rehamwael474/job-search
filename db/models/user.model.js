import pkg from 'joi';
const { required } = pkg;
import { model, Schema } from "mongoose";
import { type } from "os";
import { roles, statuses } from "../../src/utils/constant/enums.js";

// schema
const userSchema = new Schema({
  firstName:{
    type:String,
    required: true,
    trim: true
  },
  lastName:{
    type:String,
    required:true,
    trim: true
  },
 
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
},
  email:{
    type:String,
    required:true,
    unique:true,
    trim: true,
    lowercase:true
},
recoveryEmail:{
    type:String,
    trim: true,
    lowercase: true
},

password:{
  type:String,
  required:true
},

DOB:{
  type:String,
  default:Date.now()
},

phone:{
type:String,
required:true,
unique:true,
trim:true
},

role: {
  type: String,
  enum: Object.values(roles),
  default: roles.USER,

}, 

status: {
  type: String,
  enum: Object.values(statuses),
  default:statuses.OFFLINE
},


},{timestamps:true})
userSchema.pre("save", function(next){
  this.username = this.firstname + "" + this.lastname
  next()
})

//model
export const User = model('User',userSchema)