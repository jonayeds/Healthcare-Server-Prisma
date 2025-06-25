import express from 'express';  
import { PrescriptionController } from './prescription.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';

const router = express.Router();        

router.post("/",auth(UserRole.DOCTOR), PrescriptionController.createPrescription)
router.get("/my-prescriptions", auth(UserRole.PATIENT), PrescriptionController.getMyPrescriptions )

export const PrescriptionRoutes = router;   