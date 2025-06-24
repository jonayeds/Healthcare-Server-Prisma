import express from 'express';      
import { AppointmentController } from './appointment.controller';
import { UserRole } from '../../../../generated/prisma';
import auth from '../../middlewares/auth';


const router = express.Router();

router.get("/my-appointments", auth(UserRole.PATIENT, UserRole.DOCTOR), AppointmentController.getMyAppointments);
router.post("/", auth(UserRole.PATIENT), AppointmentController.createAppointment);

export const AppointmentRoutes = router;    