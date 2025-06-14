import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/picked";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await AdminService.getAllAdmins(filter, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admins fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AdminService.getAdminById(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.params.id;
    const result = await AdminService.updateAdmin(adminId, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.params.id;
    const result = await AdminService.deleteAdmin(adminId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.params.id;
    const result = await AdminService.softDeleteAdmin(adminId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin soft deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const AdminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
