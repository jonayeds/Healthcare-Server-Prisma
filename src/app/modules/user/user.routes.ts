import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { fileUploader } from "../../../helpers/uploader";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidationSchema } from "./user.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req:Request, res:Response, next:NextFunction)=>{
    req.body = JSON.parse(req.body.data);   
    next()
  },
  validateRequest(UserValidationSchema.createAdmin),
  UserController.createAdmin
);

export const UserRoutes = router;
