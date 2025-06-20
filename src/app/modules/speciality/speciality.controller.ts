import { fileUploader } from "../../../helpers/uploader";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialityService } from "./speciality.service";

const createSpeciality = catchAsync(async(req, res)=>{
    const file = req.file;
    if (file){
        req.body.icon = (await fileUploader.uploadToCloudinary(file)).optimizeUrl
    }
    const result = await SpecialityService.createSpeciality(req.body)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Speciality created successfully",
        data: result
    })
})


const getAllSpecialities = catchAsync(async(req, res)=>{
    const result = await SpecialityService.getAllSpecialities()
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Specialities fetched successfully",
        data: result
    })
})

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities
}