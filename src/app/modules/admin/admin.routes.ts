import express from "express";

import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllAdmins
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAdminById
);
router.patch(
  "/:id",
  validateRequest(adminValidationSchema.update),
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.updateAdmin
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.deleteAdmin
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.softDeleteAdmin
);

export const AdminRoutes = router;
