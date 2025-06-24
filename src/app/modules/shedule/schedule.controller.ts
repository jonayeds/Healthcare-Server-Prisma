import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/picked";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import httpStatus from "http-status";

const createSchedule = catchAsync(async (req, res) => {
  const result = await ScheduleService.createSchedule(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});
const getAllSchedules = catchAsync(async (req:Request & {user?:any}, res) => {
  const filters = pick(req.query, [
    "startDateTime",
    "endDateTime",
    "startDate",
    "endDate",
    "myAvailableSlots"
  ]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const user = req?.user
  const result = await ScheduleService.getAllSchedules(filters, options, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule fetched successfully",
    data: result,
  });
});

const getScheduleById = catchAsync(async (req:Request & {user?:any}, res) => {
  const result = await ScheduleService.getScheduleById(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule fetched successfully",
    data: result,
  });
});
const deleteSchedule = catchAsync(async (req, res) => {
  const result = await ScheduleService.deleteSchedule(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule Deleted successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  deleteSchedule
};
