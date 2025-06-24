import express from 'express';  
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';
import { DoctorScheduleController } from './doctorSchedule.controller';

const  router = express.Router();    

router.post("/", auth(UserRole.DOCTOR), DoctorScheduleController.createDoctorSchedule)
router.get("/my-schedule", auth(UserRole.DOCTOR), DoctorScheduleController.getmySchedules)
router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), DoctorScheduleController.getAllDoctorSchedules)
router.delete("/:id", auth(UserRole.DOCTOR), DoctorScheduleController.deleteMySchedule)

export const DoctorScheduleRoutes  = router
