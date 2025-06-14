import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/picked";
import { adminFilterableFields } from "./admin.constant";


const getAllAdmins = async (req: Request, res: Response) => {
  const filter = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"] )
  const result = await AdminService.getAllAdmins(filter, options);
  res.status(200).json({
    success: true,
    message: "Admins fetched successfully",
    data: result.data || [],
    meta:result.meta || {},
  });
};

const getAdminById = async (req: Request, res: Response) => {
  try {
      const result = await AdminService.getAdminById(req.params.id)
      res.status(200).json({
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
}

const updateAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
      const result = await AdminService.updateAdmin(adminId, req.body);
      res.status(200).json({
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
  } catch (error) {
    res.status(400).json({
    success: false,
    message: "Failed to update admin",
    error,
  });
  }
}

export const AdminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
};
