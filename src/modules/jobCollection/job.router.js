import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addJob, applyToJob, deleteJob, getAllJobs, getJobsByCompany, getJobsWithFilters, updateJob } from "./job.controller.js";
import { isValid } from "../../middleware/validation.js";
import { addJobVal, updateJobVal } from "./job.validation.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthourized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { cloudUploads } from "../../utils/multer-cloud.js";


const jobRouter = Router()


// add job
jobRouter.post("/",
    asyncHandler(addJob),
    isAuthenticated(),
    isAuthourized([roles.COMPANY_HR]),
    isValid(addJobVal)
)
// updateJob
jobRouter.put("/:jobId",
asyncHandler(updateJob),
isAuthenticated(),
isAuthourized([roles.COMPANY_HR]),
isValid(updateJobVal)
)

// delete job
jobRouter.delete("/:jobId",
    asyncHandler(deleteJob,
    isAuthenticated(),
    isAuthourized([roles.COMPANY_HR]),
))

// get all jobs
jobRouter.get("/",
asyncHandler(getAllJobs),
isAuthenticated(),
isAuthourized([roles.COMPANY_HR,roles.USER]))

// getJobsByCompany
jobRouter.get("/jobsByCompany",
asyncHandler(getJobsByCompany),
isAuthenticated(),
isAuthourized([roles.COMPANY_HR,,roles.USER]))

// getJobsWithFilters
jobRouter.get("/getJobsWithFilters",
asyncHandler(getJobsWithFilters),
isAuthenticated(),
isAuthourized([roles.COMPANY_HR,roles.USER]))

//applyToJob
jobRouter.post("/applyToJob",
asyncHandler(applyToJob),
isAuthenticated(),
isAuthourized([roles.USER]),
cloudUploads().single('cv'),
);
export default jobRouter