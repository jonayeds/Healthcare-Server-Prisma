import express from 'express';
import { SpecialityController } from './speciality.controller';
import { fileUploader } from '../../../helpers/uploader';
import validateRequest from '../../middlewares/validateRequest';
import { SpecialityValidationSchema } from './speciality.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma';


const router = express.Router();        

router.post("/", 
    fileUploader.upload.single("file"),
    (req,res,next)=>{
        req.body = JSON.parse(req.body.data);
        next()
    },
    validateRequest(SpecialityValidationSchema.createSpeciality),
    SpecialityController.createSpeciality)

router.get("/", auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN), SpecialityController.getAllSpecialities )
router.delete("/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), SpecialityController.deleteSpeciality )

export const SpecialityRoutes = router; 