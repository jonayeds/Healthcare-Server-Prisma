import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PrescriptionService } from "./prescription.service";
import { TAuthUser } from "../../interfaces/common";

const createPrescription = catchAsync(async(req:Request & {user?:TAuthUser}, res) => {
    const result = await PrescriptionService.createPrescription(req.body, req.user as TAuthUser); 
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Prescription created successfully",
        data: result        
    }) 
})

export const PrescriptionController = {
    createPrescription
}