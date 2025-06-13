import { Request, Response } from "express";
import { AdminService } from "./admin.service";



const getAllAdmins = async(req:Request, res:Response)=>{
    const result = await AdminService.getAllAdmins(req.query);
    res.status(200).json({
        success: true,
        message: "Admins fetched successfully",
        data: result
    })  

}

export const AdminController = {
    getAllAdmins
}