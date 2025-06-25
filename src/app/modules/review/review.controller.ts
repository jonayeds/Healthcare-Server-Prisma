import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { TAuthUser } from "../../interfaces/common";

const createReview = catchAsync(async(req:Request &{user?:TAuthUser},res)=>{
    const result = await ReviewService.createReview(req.body, req.user as TAuthUser);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Review created successfully",
        data: result            
    });  
})

export const ReviewController = {
    createReview
}