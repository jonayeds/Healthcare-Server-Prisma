import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { fileUploader } from "../../../helpers/uploader";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidationSchema } from "./user.validation";
import { JwtPayload } from "jsonwebtoken";

const router = express.Router();

router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req:Request, res:Response, next:NextFunction)=>{
    req.body = JSON.parse(req.body.data);   
    next()
  },
  validateRequest(UserValidationSchema.createAdmin),
  UserController.createAdmin
);

router.post(
  "/create-doctor",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req:Request, res:Response, next:NextFunction)=>{
    req.body = JSON.parse(req.body.data);   
    next()
  },
  validateRequest(UserValidationSchema.createDoctor),
  UserController.createDoctor
);
router.post(
  "/create-patient",
   auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req:Request, res:Response, next:NextFunction)=>{
    req.body = JSON.parse(req.body.data);   
    next()
  },
  validateRequest(UserValidationSchema.createPatient),
  UserController.createPatient
);
router.patch(
  "/update-my-profile",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),    
  fileUploader.upload.single("file"),
  (req:Request, res:Response, next:NextFunction)=>{
    req.body = JSON.parse(req.body.data);   
    next()
  }, 
  (req: Request & {user?:JwtPayload}, res,next)=>{
    if(req.user?.role === UserRole.PATIENT){
      req.body = UserValidationSchema.updateMyProfileSchemaPatient.parse({body:req.body}).body;
    }
    else if(req.user?.role === UserRole.DOCTOR){
      req.body = UserValidationSchema.updateMyProfileSchemaDoctor.parse({body:req.body}).body;
    }
    else if(req.user?.role === UserRole.ADMIN || req.user?.role === UserRole.SUPER_ADMIN){
      req.body = UserValidationSchema.updateMyProfileSchemaAdmin.parse({body:req.body}).body;
    }
    next()
  },
  UserController.updateMyProfile
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), 
  UserController.getAllUsers  
)
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), 
  validateRequest(UserValidationSchema.updateUserStatus),   
  UserController.changeProfileStatus
)

router.get("/me",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  UserController.getMyProfile
)



export const UserRoutes = router;
