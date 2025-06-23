import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import httpStatus from "http-status";        

const createDoctorSchedule = catchAsync(async(req: Request & {user?:any} ,res)=>{
    const result = await DoctorScheduleService.createDoctorSchedule(req.body, req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor schedule created successfully",
        data: result            
    })
})

const getAllDoctorSchedules = catchAsync(async(req: Request & {user?:any} ,res)=>{
    const result = await DoctorScheduleService.createDoctorSchedule(req.body, req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor schedule fetched successfully",
        data: result            
    })
})

export const DoctorScheduleController ={
    createDoctorSchedule,
    getAllDoctorSchedules
}