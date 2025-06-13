import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/picked";


const getAllAdmins = async (req: Request, res: Response) => {
  const filter = pick(req.query, ["searchTerm", "role", "status", "contactNumber", "email"]);
  const result = await AdminService.getAllAdmins(filter);
  res.status(200).json({
    success: true,
    message: "Admins fetched successfully",
    data: result,
  });
};

export const AdminController = {
  getAllAdmins,
};
