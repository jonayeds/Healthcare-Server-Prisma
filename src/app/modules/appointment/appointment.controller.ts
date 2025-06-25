import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../../shared/picked";

const createAppointment = catchAsync(async(req:Request & {user?:TAuthUser}, res)=>{
    const result = await AppointmentService.createAppointment(req.user as TAuthUser, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment created successfully",
        data: result        
    })
})

const getMyAppointments = catchAsync(async(req:Request & {user?:TAuthUser}, res)=>{
    const filters = pick(req.query, ['paymentStatus', 'status']);
    const paginationOptions = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await AppointmentService.getMyappointments(req.user as TAuthUser, filters, paginationOptions)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointments fetched successfully",
        data: result        
    })
})
const getAllAppointments = catchAsync(async(req, res)=>{
    const filters = pick(req.query, ['paymentStatus', 'status']);
    const paginationOptions = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await AppointmentService.getAllAppointments( filters, paginationOptions)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointments fetched successfully",
        data: result        
    })
})
const changeAppointmentStatus = catchAsync(async(req:Request & {user?:TAuthUser}, res)=>{
    const result = await AppointmentService.changeAppointmentStatus(req.params.id, req.body.status, req.user as TAuthUser)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment Status updated successfully",
        data: result        
    })
})


export const AppointmentController = {
    createAppointment,
    getMyAppointments,
    getAllAppointments,
    changeAppointmentStatus
}  
