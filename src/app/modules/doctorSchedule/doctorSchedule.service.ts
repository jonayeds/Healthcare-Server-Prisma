import { DoctorSchedule, Prisma } from "../../../../generated/prisma";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";

const createDoctorSchedule = async (
  payload: { schedules: string[] },
  user: any
) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });
  const doctorScheduleData = payload?.schedules?.map((sch: string) => ({
    doctorId: doctorInfo.id,
    scheduleId: sch,
  }));
  const createdDoctorSchedule = await prisma.doctorSchedule.createManyAndReturn(
    {
      data: doctorScheduleData,
      skipDuplicates: true,
    }
  );
  return createdDoctorSchedule;
};

const getMySchedules = async (
  params: any,
  options: Record<string, unknown>,
  doctor: any
) => {
  const { skip, page, limit} = calculatePagination(options);
  const {  isBooked,startDate, endDate, ...filterData } = params;
  const andConditions: Prisma.DoctorScheduleWhereInput[] = [];
  if( isBooked){
    andConditions.push({
      isBooked: isBooked === "true" ? true : false ,
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

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: new Date(startDate),
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: new Date(endDate),
            },
          },
        },
      ],
    });
  }

  andConditions.push({
    doctor:{
        email: doctor?.email,
    }
  })
  const whereConditions: Prisma.DoctorScheduleWhereInput = { AND: andConditions };
  const result = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });
  const total = await prisma.doctorSchedule.count({
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

const deleteMySchedule = async(doctor:TAuthUser, scheduleId:string )=>{
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: doctor.email,
      isDeleted: false,
    },
  });
  const deletedSchedule = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId:{
        doctorId: doctorInfo.id,
        scheduleId: scheduleId,
      },
      isBooked: false, 
    },
  });
  return deletedSchedule;
}

const getAllDoctorSchedules = async (
  params: any,
  options: Record<string, unknown>
) => {
  const { skip, page, limit} = calculatePagination(options);
  const {  isBooked,startDate, endDate, ...filterData } = params;
  const andConditions: Prisma.DoctorScheduleWhereInput[] = [];
  if( isBooked){
    andConditions.push({
      isBooked: isBooked === "true" ? true : false ,
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

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: new Date(startDate),
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: new Date(endDate),
            },
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.DoctorScheduleWhereInput = { AND: andConditions };
  const result = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include:{
      schedule: true,
    }
  });
  const total = await prisma.doctorSchedule.count({
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

export const DoctorScheduleService = {
  createDoctorSchedule,
  getMySchedules,
  deleteMySchedule,
  getAllDoctorSchedules,
};
