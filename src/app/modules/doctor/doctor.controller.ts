import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/picked";
import sendResponse from "../../../shared/sendResponse";
import { doctorFilterableFields } from "./doctor.constant";
import { DoctorService } from "./doctor.service";

const getAllDoctors = catchAsync(async(req, res)=>{
    const filterOptions = pick(req.query, doctorFilterableFields)
    const paginationOptions = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]) 
    const result = await DoctorService.getAllDoctors(filterOptions, paginationOptions) 
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctors fetched successfully",
        meta: result.meta,
        data: result.data       
    })         
})

const getDoctorById = catchAsync(async(req, res)=>{
    const result = await DoctorService.getDoctorById(req.params.id) 
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor fetched successfully",
        data: result     
    })         
}) 

const deleteDoctor = catchAsync(async(req, res)=>{
    const result = await DoctorService.deleteDoctor(req.params.id) 
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Deleted Doctor successfully",
        data: result     
    })         
})
const softDeleteDoctor = catchAsync(async(req, res)=>{
    const result = await DoctorService.softDeleteDoctor(req.params.id) 
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Soft deleted doctor successfully",
        data: result     
    })         
})

const updateDoctor = catchAsync(async(req, res)=>{
    const result = await DoctorService.updateDoctor(req.params.id, req.body) 
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Updated doctor successfully",
        data: result     
    })         
})           

export const DoctorController = {
    getAllDoctors,
    deleteDoctor,
    softDeleteDoctor,
    getDoctorById,
    updateDoctor
}