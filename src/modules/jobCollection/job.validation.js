import joi from 'joi'
import {generalField} from '../../middleware/validation.js'

export const addJobVal = joi.object({
    jobTitle: generalField.jobTitle.required(),
    jobDescription:generalField.jobDescription.required(),
    jobLocation:generalField.jobLocation.required(),
    workingTime:generalField.workingTime.required(),
    seniorityLevel:generalField.seniorityLevel.required(),
    technicalSkills:generalField.technicalSkills.required(),
    softSkills:generalField.technicalSkills.required(),
    createdBy:generalField.createdBy.required(),
    updatedBy:generalField.createdBy.required(),

})

export const updateJobVal = joi.object({
    jobId: joi.string().required(),
    jobTitle: generalField.jobTitle.required(),
    jobDescription:generalField.jobDescription.required(),
    jobLocation:generalField.jobLocation.required(),
    workingTime:generalField.workingTime.required(),
    seniorityLevel:generalField.seniorityLevel.required(),
    technicalSkills:generalField.technicalSkills.required(),
    softSkills:generalField.technicalSkills.required(),

})