import expres from 'express';   
import { DoctorController } from './doctor.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';

const router = expres.Router();     

router.get("/", DoctorController.getAllDoctors)
router.delete("/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),  DoctorController.deleteDoctor)
router.delete("/soft-delete/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), DoctorController.softDeleteDoctor)                

export const DoctorRoutes = router; 