import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PrescriptionService } from "./prescription.service";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../../shared/picked";

const createPrescription = catchAsync(async(req:Request & {user?:TAuthUser}, res) => {
    const result = await PrescriptionService.createPrescription(req.body, req.user as TAuthUser); 
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Prescription created successfully",
        data: result        
    }) 
})
const getMyPrescriptions = catchAsync(async(req:Request & {user?:TAuthUser}, res) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await PrescriptionService.getMyPrescriptions(req.user as TAuthUser, options); 
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My Prescriptions Fetched successfully",
        data: result.data,
        meta: result.meta        
    }) 
})
const getAllPrescriptions = catchAsync(async(req:Request & {user?:TAuthUser}, res) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, ['searchTerm', 'doctorId', 'patientId', 'appointmentId']);  
    const result = await PrescriptionService.getAllPrescriptions(filters, options); 
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Prescriptions Fetched successfully",
        data: result.data,
        meta: result.meta        
    }) 
})

export const PrescriptionController = {
    createPrescription,
    getMyPrescriptions,
    getAllPrescriptions
}