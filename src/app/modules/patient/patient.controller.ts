import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/picked";
import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import { PatientService } from "./patient.service";
import { patientFilterableFields } from "./patient.constant";

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PatientService.getAllPatients(filter, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PatientController = {
  getAllPatients,
};
