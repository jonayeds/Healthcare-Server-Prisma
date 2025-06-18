import { Request, Response } from "express";
import { UserService } from "./user.service";

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

export const UserController = {
    createAdmin,
    createDoctor,
    createPatient
}