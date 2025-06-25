import prisma from "../../../shared/prisma";
import { ApiError } from "../../errors/ApiError";
import { TAuthUser } from "../../interfaces/common";
import httpStatus from "http-status";

const createReview = async (payload: any, user: TAuthUser) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
    include: {
      patient: true,
    },
  });
  if (appointmentData.patient.email !== user.email || appointmentData.patient.isDeleted) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to create a review for this appointment"
    );
  }
  const result = await prisma.review.create({
    data:{
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        rating: payload.rating,
        comment: payload?.comment, 
    }
  })
  return result
};

export const ReviewService = {
  createReview,
};
