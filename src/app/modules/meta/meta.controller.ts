import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MetaService } from "./meta.service";
import { TAuthUser } from "../../interfaces/common";

const fetchDashboardData = catchAsync(async(req:Request & {user?:TAuthUser}, res)=>{
    const user = req.user;
    const result = await MetaService.fetchDashboardData(user as TAuthUser)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Dashboard data fetched successfully",
        data: result    
    })
})

export const MetaController = {
    fetchDashboardData
}           