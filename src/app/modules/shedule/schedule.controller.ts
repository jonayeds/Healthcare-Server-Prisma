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
const getAllSchedules = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    "startDateTime",
    "endDateTime",
    "doctorId",
    "startDate",
    "endDate",
  ]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ScheduleService.getAllSchedules(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule fetched successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
};
