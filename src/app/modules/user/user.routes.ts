import express from 'express';
import { UserController } from './user.controller';

import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';

const router = express.Router() 


router.post('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),  UserController.createAdmin)

export const UserRoutes = router 