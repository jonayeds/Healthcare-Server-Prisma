import express from 'express';  
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';


const router = express.Router();  

router.post("/:appointmentId",auth(UserRole.PATIENT), PaymentController.initPayment)


export const PaymentRoutes = router;