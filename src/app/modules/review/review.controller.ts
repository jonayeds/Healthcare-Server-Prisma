import { Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../../shared/picked";

const createReview = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await ReviewService.createReview(
      req.body,
      req.user as TAuthUser
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

const getAllReviews = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const filters = pick(req.query, ["searchTerm", "doctorId", "patientId", "appointmentId" ]);
    const paginationOptions = pick(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    const result = await ReviewService.getAllReviews(
      filters,
      paginationOptions
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Reviews fetched successfully",
      data: result,
    });
  }
);

export const ReviewController = {
  createReview,
  getAllReviews
};
