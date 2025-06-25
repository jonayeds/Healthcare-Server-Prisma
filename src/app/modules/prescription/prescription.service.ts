import { AppointmentStatus, Prescription, Prisma } from "../../../../generated/prisma";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";

const createPrescription = async (
  payload: Partial<Prescription>,
  user: TAuthUser
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      doctor: {
        email: user.email,
      },
    },
  });

  const result = await prisma.prescription.create({
    data: {
      appointmentId: payload.appointmentId as string,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload?.followUpDate || null,
    },
  });
  return result;
};

const getMyPrescriptions = async (
  user: TAuthUser,
  options: IPaginationOptions
) => {
  const { skip, page, limit, sortOrder, sortBy } = calculatePagination(options);
  const myPrescriptions = await prisma.prescription.findMany({
    where: {
        patient: {
            email: user.email,
        },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
  });
  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user.email,
      },
    },
  });
  return {
    data: myPrescriptions,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getAllPrescriptions = async(params:any, options:IPaginationOptions)=>{
    const { skip, page, limit, sortOrder, sortBy } = calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andConditions: Prisma.PrescriptionWhereInput[] = [];
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
    const whereConditions: Prisma.PrescriptionWhereInput = { AND: andConditions };
  const myPrescriptions = await prisma.prescription.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
  });
  const total = await prisma.prescription.count();
  return {
    data: myPrescriptions,
    meta: {
      page,
      limit,
      total,
    },
  };
}

export const PrescriptionService = {
  createPrescription,
  getMyPrescriptions,
  getAllPrescriptions
};
