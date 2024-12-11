import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addCompany, deleteCompany, getCompanyData, getJobApplications, searchCompany, updateCompany } from "./company.controller.js";
import { isValid } from "../../middleware/validation.js";
import { addCompanyVal, updatedCompanyVal } from "./company.validation.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";



const companyRouter = Router()
//add company
companyRouter.post('/',
    asyncHandler(addCompany),
    isAuthenticated(),
    isAuthourized([roles.COMPANY_HR]),
    isValid(addCompanyVal))
// update company
companyRouter.put('/:companyId',
asyncHandler(updateCompany),
isAuthenticated(),
isAuthourized([roles.COMPANY_HR]),
isValid(updatedCompanyVal))
// delete company data
companyRouter.delete('/:companyId',
asyncHandler(deleteCompany,
isAuthenticated(),
isAuthourized([roles.COMPANY_HR]),
))
//get company data
companyRouter.get('/',
asyncHandler(getCompanyData),
isAuthenticated(),
isAuthourized([roles.COMPANY_HR]))
// search company
companyRouter.get("/searchCompany",
asyncHandler(searchCompany),
isAuthenticated(),
isAuthourized([roles.USER,roles.COMPANY_HR]))
// get apllications
companyRouter.get("/getApllications",
asyncHandler(getJobApplications),
isAuthenticated(),
isAuthourized([roles.COMPANY_HR])) 
export default companyRouter