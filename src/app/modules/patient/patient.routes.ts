import express from "express";
import { PatientController } from "./patient.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  PatientController.getAllPatients
);


export const PatientRoutes = router;