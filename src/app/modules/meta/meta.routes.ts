import expresss from 'express';     
import { MetaController } from './meta.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';

const router = expresss.Router();   

router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT), MetaController.fetchDashboardData)

export const MetaRoutes = router