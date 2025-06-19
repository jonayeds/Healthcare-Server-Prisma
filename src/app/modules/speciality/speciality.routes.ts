import express from 'express';
import { SpecialityController } from './speciality.controller';
import { fileUploader } from '../../../helpers/uploader';


const router = express.Router();        

router.post("/", 
    fileUploader.upload.single("file"),
    (req,res,next)=>{
        req.body = JSON.parse(req.body.data);
        next()
    },
    SpecialityController.createSpeciality)

export const SpecialityRoutes = router; 