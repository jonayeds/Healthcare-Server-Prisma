import { Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/picked";
import { userFilterableFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";
import { fileUploader } from "../../../helpers/uploader";

const createAdmin = async(req:Request, res:Response)=>{
    try {
        const result = await UserService.createAdmin(req);
    res.status(200).json({
        success: true,
        message: "Admin created successfully",      
        data: result    
    })  
    } catch (error:any) {
        res.status(200).json({
        success: false,
        message: error?.message || "Failed to create admin",      
        error   
    })  
    }  
}
const createDoctor = async(req:Request, res:Response)=>{
    try {
        const result = await UserService.createDoctor(req);
    res.status(200).json({
        success: true,
        message: "Doctor created successfully",      
        data: result    
    })  
    } catch (error:any) {
        res.status(200).json({
        success: false,
        message: error?.message || "Failed to create doctor",      
        error   
    })  
    }  
}

const createPatient = async(req:Request, res:Response)=>{
    try {
        const result = await UserService.createPatient(req);
    res.status(200).json({
        success: true,
        message: "Patient created successfully",      
        data: result    
    })  
    } catch (error:any) {
        res.status(200).json({
        success: false,
        message: error?.message || "Failed to create patient",      
        error   
    })  
    }  
}

const getAllUsers = catchAsync(async(req, res)=>{
    const filter = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await UserService.getAllUsers(filter, options);
    sendResponse(res,{
        success: true,
        statusCode: 200,
        message: "Users fetched successfully",
        data: result.data,
        meta: result.meta
    })
})

const changeProfileStatus = catchAsync(async(req, res)=>{
    const result = await UserService.changeProfileStatus(req.params.id, req.body);
    sendResponse(res,{
        success: true,
        statusCode: 200,
        message: "Users fetched successfully",
        data: result
    })
})
const getMyProfile = catchAsync(async(req: Request & {user?:JwtPayload}, res)=>{
    const user = req.user;
    const result = await UserService.getMyProfile(user);
    sendResponse(res,{
        success: true,
        statusCode: 200,
        message: "Users fetched successfully",
        data: result
    })
})
const updateMyProfile = catchAsync(async(req: Request & {user?:JwtPayload}, res)=>{
    const user = req.user;
    const file = req.file;
    console.log(req.body)
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.profilePhoto = uploadToCloudinary?.optimizeUrl;        
    }
    const result = await UserService.updateMyProfile(user as JwtPayload, req.body);
    sendResponse(res,{
        success: true,
        statusCode: 200,
        message: "Profile updated successfully",
        data: result
    })
})

export const UserController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
}