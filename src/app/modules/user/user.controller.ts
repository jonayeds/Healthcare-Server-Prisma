import { Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async(req:Request, res:Response)=>{
    try {
        const result = await UserService.createAdmin(req.body);
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

export const UserController = {
    createAdmin
}