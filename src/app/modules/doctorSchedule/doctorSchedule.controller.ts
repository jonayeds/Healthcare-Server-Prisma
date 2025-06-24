import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import httpStatus from "http-status";
import pick from "../../../shared/picked";
import { TAuthUser } from "../../interfaces/common";

const createDoctorSchedule = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const result = await DoctorScheduleService.createDoctorSchedule(
      req.body,
      req.user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor schedule created successfully",
      data: result,
    });
  }
);

const getmySchedules = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const filters = pick(req.query, ["isBooked", "startDate", "endDate"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await DoctorScheduleService.getMySchedules(
      filters,
      options,
      req.user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor schedule fetched successfully",
      data: result,
    });
  }
);

const deleteMySchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await DoctorScheduleService.deleteMySchedule(
      req.user as TAuthUser,
      req.params.id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor schedule delete successfully",
      data: result,
    });
  }
);

const getAllDoctorSchedules = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const filters = pick(req.query, ["isBooked","doctorId", "scheduleId", "startDate", "endDate"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await DoctorScheduleService.getAllDoctorSchedules(
      filters,
      options,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor schedules Fetched successfully",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  createDoctorSchedule,
  getmySchedules,
  deleteMySchedule,
  getAllDoctorSchedules
};
