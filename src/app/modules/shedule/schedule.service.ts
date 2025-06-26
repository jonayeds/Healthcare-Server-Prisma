import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { IFilterRequest, ISchedule } from "./schedule.interface";
import { Prisma, Schedule, UserRole } from "../../../../generated/prisma";
import calculatePagination from "../../../helpers/paginationHelper";
import { ApiError } from "../../errors/ApiError";
import httpStatus from "http-status";

const convertDateTime = async(date:Date)=>{
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() + offset);
}


const createSchedule = async (
  payload: ISchedule
): Promise<Schedule[] | null> => {
  const { startDate, endDate, startTime, endTime } = payload;
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const scheduleData = [];
  while (currentDate <= lastDate) {
    let startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    let endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      // scheduleData.push({
      //   startDateTime,
      //   endDateTime: addHours(startDateTime, 0.5),
      // });
      const s = await convertDateTime(startDateTime)
      const e = await convertDateTime(addHours(startDateTime, 0.5))
      scheduleData.push({
        startDateTime:s,
        endDateTime:e,
      });

      startDateTime = addHours(startDateTime, 0.5);
    }
    currentDate = addHours(currentDate, 24);
  }
  const result = await prisma.schedule.createManyAndReturn({
    data: scheduleData,
    skipDuplicates: true,
  });
  if (result.length === 0) {
    throw new Error(
      "Schedule already exists for the given date range and time"
    );
  }
  return result;
};

const getAllSchedules = async (
  params: IFilterRequest,
  options: Record<string, unknown>,
  doctor: any
): Promise<{
  data: Schedule[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}> => {
  const { skip, page, limit, sortOrder, sortBy } = calculatePagination(options);
  const { myAvailableSlots, startDate, endDate, ...filterData } = params;
  const andConditions: Prisma.ScheduleWhereInput[] = [];
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
          startDateTime: {
            gte: new Date(startDate),
          },
        },
        {
          endDateTime: {
            lte: new Date(endDate),
          },
        },
      ],
    });
  }
  if (myAvailableSlots === "true" && doctor.role === UserRole.DOCTOR) {
    const doctorSchedules = await prisma.doctorSchedule.findMany({
      where: {
        doctor: {
          email: doctor?.email,
        },
      },
    });

    const scheduleIds = doctorSchedules.map((schedule) => schedule.scheduleId);
    andConditions.push({
      id: {
        notIn: scheduleIds,
      },
    });
  }
  const whereConditions: Prisma.ScheduleWhereInput = { AND: andConditions };
  const result = await prisma.schedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
  });
  const total = await prisma.schedule.count({
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

const getScheduleById = async (scheduleId: string) => {
  const result = await prisma.schedule.findUniqueOrThrow({
    where: {
      id: scheduleId,
    },
  });
  return result;
};

const deleteSchedule = async (scheduleId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const doctorScheduleData = await tx.doctorSchedule.findMany({
      where: {
        scheduleId: scheduleId,
      },
    });
    doctorScheduleData.forEach((doctorSchedule) => {
      if (doctorSchedule.isBooked) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Cannot delete schedule as it is already booked"
        );
      }
    });
    await tx.doctorSchedule.deleteMany({
      where: {
        scheduleId: scheduleId,
      },
    });
    const deletedSchedule = await tx.schedule.delete({
      where: {
        id: scheduleId,
      },
    });

    return deletedSchedule;
  });
  return result;
};

export const ScheduleService = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  deleteSchedule,
};
