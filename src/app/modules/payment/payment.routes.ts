import express from 'express';  
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';


const router = express.Router();  

router.post("/:appointmentId",auth(UserRole.PATIENT), PaymentController.initPayment)
router.get("/ipn",auth(UserRole.PATIENT), PaymentController.validatePayment)


export const PaymentRoutes = router;