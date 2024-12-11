import { AppError } from '../../utils/appError.js'
import { Application, Company, Job } from "../../../db/index.js"
import { messages } from '../../utils/constant/messages.js'

// add company
export const addCompany = async (req, res, next) => {
     // Get data from req
     let { companyName, industry, description , numberOfEmployees,companyEmail, address} = req.body;
     const companyHR = req.authUser._id;
    
    // Check existence
    const companyExist = await Company.findOne({$or: [{ companyName }, { companyEmail }]});
    if (companyExist) {
        return next(new AppError(messages.company.alreadyExist, 404));
    }

    // Prepare data
    const company = new Company({
        companyName,
        industry,
        description,
        numberOfEmployees,
        companyEmail,
        companyHR,
        address
        
    });
     // add to db
    const createdCompany = await company.save();
    if (!createdCompany) {
        return next(new AppError(messages.company.failToCreate, 500));
    }

    // Send response
    return res.status(201).json({ Message:messages.company.createdSuccessfully, success: true, data: createdCompany });
};

// update company data 
export const updateCompany = async (req, res, next) => {
    // get data from req
    const {companyName,industry,description} = req.body
    const {companyId} = req.params
  // check existence
  const checkCompanyExist = await Company.findOne({$or:[{companyName}, { companyEmail },{companyId}]})
  if(checkCompanyExist){
      return next(AppError(messages.company.alreadyExist, 404))
  }
  
    const companyExist = await Company.findOne({_id:req.authUser._id,companyHR:req.authUser._id})
    if(!companyExist){
        next(new AppError("not athorized to update" , 409))
    }
   
    // add to db
    const updatedCompany = await Company.findByIdAndUpdate(companyId, req.body, { new: true });
    if(!updateCompany){
        return next (new AppError (messages.company.failToUpdate,500))
    }

    // Send response
    return res.status(200).json({ Message:messages.company.updatedSuccessfully, success: true, data: updatedCompany });
};

// delete company data
export const deleteCompany = async (req, res, next) => {
       // get data from req
        const { companyId } = req.params;
        // check existence
        const checkCompanyExist = await Company.findById(companyId);
        if (!checkCompanyExist) {
            return next(new AppError(messages.company.notFound, 404));
        }
        const companyExist = await Company.findOne({_id:req.authUser._id,company_HR:req.authUser._id})
    if(!companyExist){
        next(new AppError("not athorized to update" , 409))
    }
        // Delete the company from the database
        const deleteCompany = await Company.findByIdAndDelete(companyId,req.body, { new: true });
        if(!deleteCompany){
            next(new AppError(messages.company.notFound, 404))
        }
    
        // Send response
        return res.status(200).json({
            Message: messages.company.deletedSuccessfuly,
            success: true,
        });
    };

// get Company Data
export const getCompanyData = async (req, res, next) => {
    //get data from req
    const {companyId} = req.params
     //check existance
     const companyExist = await Company.findById(companyId);
        if (!companyExist) {
            return next(new AppError(messages.company.notFound, 404));
        }
        // Send response
        return res.status(200).json({
            message: messages.company.getSuccessfully,
            success: true,
            data: companyExist,
        });
   
};

// search company
export const searchCompany = async (req, res, next) => {
   // get data from req
    const { companyName } = req.query;
    const companyExist = await Company.findOne({ companyName });
    if (!companyExist) {
        return next(new AppError(messages.company.notFound , 404))
      }
    // send response
    return res.status(200).json({message:messages.company.getSuccessfully,
        success: true,data: companyExist });
    };

// get apllications
export const getJobApplications = async (req, res, next) => {
    // get data from req
    const {jobId} = req.params
    const job = await Job.findOne({ _id: jobId, companyHR: req.authUser._id });
    if (!job) {
    return next(new AppError({message:messages.job.failToApplay}));
    }
    const applications = await Application.find({ job: jobId }).populate('user'); 
     // send response
    return res.status(200).json({ success: true, data: applications });
};

