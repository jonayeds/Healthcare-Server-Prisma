import express from 'express';  
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';

const router = express.Router();            

router.post("/",auth(UserRole.PATIENT),validateRequest(ReviewValidation.createReview), ReviewController.createReview)
router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), ReviewController.getAllReviews)

export const ReviewRoutes = router; 