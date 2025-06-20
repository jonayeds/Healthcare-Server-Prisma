import expres from 'express';   
import { DoctorController } from './doctor.controller';

const router = expres.Router();     

router.get("/", DoctorController.getAllDoctors)


export const DoctorRoutes = router; 