import express from "express";
import { PatientController } from "./patient.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import validateRequest from "../../middlewares/validateRequest";
import { patientValidationSchema } from "./patient.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  PatientController.getAllPatients
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  PatientController.getASinglePatient
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  PatientController.deletePatient
);
router.delete(
  "/soft-delete/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  PatientController.softDeletePatient
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(patientValidationSchema.updatePatient),
  PatientController.updatePatient
);


export const PatientRoutes = router;