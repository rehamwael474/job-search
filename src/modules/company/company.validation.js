import joi from "joi";
import { generalField } from "../../middleware/validation.js";

export const addCompanyVal = joi.object({
    companyName:generalField.companyName.required(),
    industry:generalField.industry.required(),
    description:generalField.description.required(),
    companyHR:generalField.companyHR.required(),
    companyEmail:generalField.companyEmail.required(),
    address:generalField.address.required(),
})

export const updatedCompanyVal = joi.object({
    companyName:generalField.companyName,
    companyId:generalField.objectId.required()
})