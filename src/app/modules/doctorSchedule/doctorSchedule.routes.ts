import express from 'express';  
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';
import { DoctorScheduleController } from './doctorSchedule.controller';

const  router = express.Router();    

router.post("/", auth(UserRole.DOCTOR), DoctorScheduleController.createDoctorSchedule)

export const DoctorScheduleRoutes  = router
