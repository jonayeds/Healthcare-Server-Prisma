import express from "express";
import { PrescriptionController } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import validateRequest from "../../middlewares/validateRequest";
import { PrescriptionValidation } from "./prescription.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(PrescriptionValidation.createPrescription),
  PrescriptionController.createPrescription
);
router.get(
  "/my-prescriptions",
  auth(UserRole.PATIENT),
  PrescriptionController.getMyPrescriptions
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  PrescriptionController.getAllPrescriptions
);

export const PrescriptionRoutes = router;
