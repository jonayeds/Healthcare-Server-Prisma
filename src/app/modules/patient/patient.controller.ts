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

const getASinglePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.getPatientById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient fetched successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.updatePatient(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.deletePatient(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

export const PatientController = {
  getAllPatients,
  getASinglePatient,
  updatePatient,
  deletePatient
};
