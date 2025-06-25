import prisma from "../../../shared/prisma";
import { ApiError } from "../../errors/ApiError";
import { TAuthUser } from "../../interfaces/common";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { Prisma } from "../../../../generated/prisma";

const createReview = async (payload: any, user: TAuthUser) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
    include: {
      patient: true,
    },
  });
  if (
    appointmentData.patient.email !== user.email ||
    appointmentData.patient.isDeleted
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to create a review for this appointment"
    );
  }

  const result = await prisma.$transaction(async(tx)=>{
    const review =await prisma.review.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      rating: payload.rating,
      comment: payload?.comment,
    },
  });
  const averageRating = await tx.review.aggregate({
    where:{
        doctorId: appointmentData.doctorId,
    },
    _avg:{
        rating: true,
    }
  })

  await tx.doctor.update({
    where:{
        id: appointmentData.doctorId,   
    },
    data:{
        averageRating: averageRating._avg.rating || 0
    }
  })
  return review;

  })
  
  return result;
};

const getAllReviews = async (params: any, options: IPaginationOptions) => {
  const { skip, page, limit, sortOrder, sortBy } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.ReviewWhereInput[] = [];
  if (params?.searchTerm) {
    andConditions.push({
      OR: [
        {
          patient: {
            email: {
              contains: params.searchTerm as string,
              mode: "insensitive",
            },
          },
        },
        {
          doctor: {
            email: {
              contains: params.searchTerm as string,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.ReviewWhereInput = { AND: andConditions };
  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });
  const total = await prisma.review.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const ReviewService = {
  createReview,
  getAllReviews,
};
