import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { fileUploader } from "../../../helpers/uploader";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidationSchema } from "./user.validation";

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
  auth(UserRole.PATIENT, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req:Request, res:Response, next:NextFunction)=>{
    req.body = JSON.parse(req.body.data);   
    next()
  },
  validateRequest(UserValidationSchema.createPatient),
  UserController.createPatient
);

export const UserRoutes = router;
