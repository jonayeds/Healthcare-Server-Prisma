import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { TAuthUser } from "../../interfaces/common";

const createAppointment = catchAsync(async(req:Request & {user?:TAuthUser}, res)=>{
    const result = await AppointmentService.createAppointment(req.user as TAuthUser, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment created successfully",
        data: result        
    })
})


export const AppointmentController = {
    createAppointment
}  
