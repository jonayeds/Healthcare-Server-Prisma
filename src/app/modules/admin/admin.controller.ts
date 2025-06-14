import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/picked";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";



const getAllAdmins = async (req: Request, res: Response) => {
  const filter = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AdminService.getAllAdmins(filter, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admins fetched successfully",
    meta: result.meta,
    data: result.data,
  });
};

const getAdminById = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getAdminById(req.params.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch admin",
      error,
    });
  }
};

const updateAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const result = await AdminService.updateAdmin(adminId, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.message || "Failed to update admin",
      error,
    });
  }
};

const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const result = await AdminService.deleteAdmin(adminId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.message || "Failed to delete admin",
    });
  }
};
const softDeleteAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const result = await AdminService.softDeleteAdmin(adminId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin soft deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.message || "Failed to delete admin",
    });
  }
};

export const AdminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
