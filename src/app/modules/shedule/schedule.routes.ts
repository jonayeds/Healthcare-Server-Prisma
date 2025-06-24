import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleController.createSchedule
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  ScheduleController.getAllSchedules
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  ScheduleController.getScheduleById
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleController.deleteSchedule
);

export const ScheduleRoutes = router;
