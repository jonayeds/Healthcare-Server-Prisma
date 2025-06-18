import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';
import { fileUploader } from '../../../helpers/uploader';

const router = express.Router() 

router.post('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), fileUploader.upload.single('file'),  UserController.createAdmin)

export const UserRoutes = router 