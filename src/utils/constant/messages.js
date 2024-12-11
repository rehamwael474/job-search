
import pkg from 'jsonwebtoken';
const { verify } = pkg;
const generateMessages = (entity) => ({
    alreadyExist: `${entity} already exist`,
        notFound: `${entity} not found`,
        invalidCredentials: `${entity} invalid credentials`,
        createdSuccessfully: `${entity} created successfully`,
        updatedSuccessfully: `${entity} updated successfully`,
        deletedSuccessfuly: `${entity} deleted successfully`,
        getSuccessfully: `${entity} get successfully`,
        failToCreate: `fail to create ${entity}`,
        failToUpdate: `fail to update ${entity}`,
        failToDelete: `fail to delete ${entity}`,
        forbidden: `Forbidden: Insufficient permissions ${entity}` ,
        failToApplay:`Failed to apply for job ${entity}`,
        submittedSuccessfully:`Application submitted successfully ${entity}`,
        notAuthorized:`user not authorized to access this api ${entity}`
})
export const messages = {
    user:generateMessages('user'),
    company:generateMessages('company'),
    job: generateMessages('job'),
    application: generateMessages('application'),
    user:{...generateMessages('user'),verified:"user verified successfully"}
    
}