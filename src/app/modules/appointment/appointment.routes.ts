import express from "express";
import { AppointmentController } from "./appointment.controller";
import { UserRole } from "../../../../generated/prisma";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AppointmentValidation } from "./appointment.validation";

const router = express.Router();

router.get(
  "/my-appointments",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointments
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AppointmentController.getAllAppointments
);
router.post(
  "/",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  validateRequest(AppointmentValidation.createAppointment),
  AppointmentController.createAppointment
);

export const AppointmentRoutes = router;
