import { AppError } from '../../utils/appError.js'
import { Application, Company, Job } from "../../../db/index.js"
import { messages } from '../../utils/constant/messages.js'

// add job
export const addJob = async (req, res, next) => {

    // Get data from req
    const { jobTitle, jobDescription, jobLocation, workingTime, seniorityLevel, technicalSkills,softSkills,companyId } = req.body;
    // check existence
    const jobExist = await Job.findOne({jobTitle})
    if(jobExist){
        return next(new AppError(messages.job.alreadyExist,409))
    }

    // Prepare data
    const job = new Job({
        jobTitle,
        jobDescription,
        jobLocation,
        workingTime,
        seniorityLevel,
        technicalSkills,
        softSkills,
        companyId,
        createdBy:req.authUser._id,
    });

    //add to db
    const createdJob = await job.save();
    if (!createdJob) {
        return next(new AppError(messages.job.failToCreate, 500));
    }

    // Send response
    return res.status(201).json({ Message:messages.job.createdSuccessfully,
        success: true,
        data: createdJob });
};

// update job
export const updateJob = async (req, res, next) => {
  // get data from request
  const { jobTitle, jobDescription, jobLocation, workingTime, seniorityLevel, technicalSkills,softSkills} = req.body
  const {jobId} = req.params
    const updatedJob = await Job.findByIdAndUpdate(jobId);
    if (!updatedJob) {
        return next(new AppError(messages.job.failToUpdate, 500));
    }
    // Send response
    return res.status(200).json({ Message:messages.job.updatedSuccessfully,
        success: true,
         data: updatedJob });
};


// delete job
export const deleteJob = async (req, res, next) => {
        // get data from req
        const { jobId } = req.params;

        const deletedJob = await Job.findByIdAndDelete(jobId);
        if (!deletedJob) {
            return next(new AppError(messages.job.notFound ,500))
        }
    
        // Send response
        return res.status(200).json({
            Message: messages.job.deletedSuccessfuly,
            success: true,
        });
    };

// get all jobs
export const getAllJobs = async (req, res, next) => {
  
        // Fetch all jobs and populate company information
        const jobs = await Job.find().populate('company');
        if(!jobs){
            next(new AppError(messages.job.notFound , 404))
        }

        // Send response
        return res.status(200).json({
            message: messages.job.getSuccessfully,
            success: true,
            data: jobs,
        });
};


// getJobsByCompany
export const getJobsByCompany = async (req, res, next) => { 
    // Get data from req 
      // get data from req
      const {companyName} = req.body
      const company = await Company.findOne({companyName})
      if(company){
          next(new AppError(messages.company.notFound,404))
      }
      const jobs = await Job.find({ createdBy:company?.companyHR });
         // Send response
          return res.status(200).json({ message: messages.job.getSuccessfully, success: true, data: jobs, });
        }
     

//getJobsWithFilters
export const getJobsWithFilters = async (req, res, next) => {
  
// get data from request
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

    const filters = {};
    if (workingTime) filters.workingTime = workingTime;
    if (jobLocation) filters.location = jobLocation;
    if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
    if (jobTitle) filters.title = new RegExp(jobTitle, 'i'); 
    if (technicalSkills) filters.technicalSkills = { $in: technicalSkills.split(',') }; 

    const jobs = await Job.find(filters).populate('company');
    // send response
    
    return res.status(200).json({ success: true, data: jobs });
};

//applyToJob
export const applyToJob = async (req, res, next) => {
    const { jobId,  technicalSkills,softSkills} = req.body;
    const userId = req.authUser._id
     //upload to clodinary
     const {secure_url, public_id} = await cloudinary.uploader.upload(
        req.file.path,{
        folder:"jobSearch/userResume"
    })
    // Check if the job exists
  const jobExist = await Job.findById(jobId);
  if (!jobExist) {
    return next(new AppError(messages.job.notFound, 404));
  }
    // Create application document
    const application = new Application({
        userId,
        jobId,
        technicalSkills,
        softSkills,
        userResume :{secure_url, public_id},
        
    });
// add to db
    const createdApplication = await application.save();
    if (!createdApplication) {
        return next(new AppError(messages.application.failToApplay, 500));
    }
// send response
    return res.status(201).json({ Message:messages.application.submittedSuccessfully, success: true, data: createdApplication });
};