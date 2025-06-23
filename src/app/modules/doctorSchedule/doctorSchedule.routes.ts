import express from 'express';  
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';
import { DoctorScheduleController } from './doctorSchedule.controller';

const  router = express.Router();    

router.post("/", auth(UserRole.DOCTOR), DoctorScheduleController.createDoctorSchedule)
router.get("/my-schedule", auth(UserRole.DOCTOR), DoctorScheduleController.getmySchedules)

export const DoctorScheduleRoutes  = router
