import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import httpStatus from "http-status";        
import pick from "../../../shared/picked";

const createDoctorSchedule = catchAsync(async(req: Request & {user?:any} ,res)=>{
    const result = await DoctorScheduleService.createDoctorSchedule(req.body, req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor schedule created successfully",
        data: result            
    })
})

const getmySchedules = catchAsync(async(req: Request & {user?:any} ,res)=>{
    const filters = pick(req.query, ["isBooked"])
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"])           
    const result = await DoctorScheduleService.getMySchedules(filters, options, req.user)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor schedule fetched successfully",
        data: result            
    })
})

export const DoctorScheduleController ={
    createDoctorSchedule,
    getmySchedules
}