import { NextFunction, Request, Response } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "../../../generated/prisma/runtime/library";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let success: boolean = false;
  let message: string = err.message || "Something went wrong";
  let error: Error | string = err;
  if (err instanceof PrismaClientValidationError) {
    statusCode = httpStatus.NON_AUTHORITATIVE_INFORMATION;
    message = "Validation Error";
    error = new Error("Validation Error: " + err.message);
  } else if (err instanceof PrismaClientKnownRequestError) {
    statusCode = httpStatus.BAD_REQUEST;
    if (err.code === "P2002") {
      message = `${err.meta?.modelName} already exists with ${(
        err.meta?.target as string[]
      ).join(", ")}`;
    }
  }
  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
