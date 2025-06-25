import { AppointmentStatus, Prisma, UserRole } from "../../../../generated/prisma";
import httpStatus from "http-status"; 
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { ApiError } from "../../errors/ApiError";
import { TAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";

const createAppointment = async (user: TAuthUser, payload: any) => {
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });
  console.log(payload);
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });
  const doctorScheduleInfo = await prisma.doctorSchedule.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorInfo.id,
        scheduleId: payload.scheduleId,
      },
      isBooked: false,
    },
  });
  const videoCallingId = uuidv4();
  const result = await prisma.$transaction(async (tx) => {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patientInfo.id,
        doctorId: doctorInfo.id,
        scheduleId: doctorScheduleInfo.scheduleId,
        videoCallingId,
      },
    });
    await tx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorInfo.id,
          scheduleId: doctorScheduleInfo.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointment.id,
      },
    });
    const today = new Date();
    const transactionId = `HEALTHCARE-${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;
    await tx.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: doctorInfo.appointmentFee,
        transactionId,
      },
    });
    return appointment;
  });
  return result;
};

const getMyappointments = async (
  user: TAuthUser,
  params: any,
  options: any
) => {
  const { skip, page, limit, sortOrder, sortBy } = calculatePagination(options);
  const { paymentStatus, ...filterData } = params;
  const andConditions: Prisma.AppointmentWhereInput[] = [];
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  if (paymentStatus) {
    andConditions.push({
      payment: {
        status: {
          equals: paymentStatus,
        },
      },
    });
  }

  if (user.role === "DOCTOR") {
    andConditions.push({
      doctor: {
        email: user.email,
      },
    });
  } else if (user.role === "PATIENT") {
    andConditions.push({
      patient: {
        email: user.email,
      },
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput = { AND: andConditions };
  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
    include: {
      doctor: user.role === UserRole.PATIENT ? true : false,
      patient: user.role === UserRole.DOCTOR ? true : false,
      schedule: true,
    },
  });
  const total = await prisma.appointment.count({
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
const getAllAppointments = async (
  params: any,
  options: any
) => {
  const { skip, page, limit, sortOrder, sortBy } = calculatePagination(options);
  const { paymentStatus, ...filterData } = params;
  const andConditions: Prisma.AppointmentWhereInput[] = [];
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  if (paymentStatus) {
    andConditions.push({
      payment: {
        status: {
          equals: paymentStatus,
        },
      },
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput = { AND: andConditions };
  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
    include: {
      doctor:true,
      patient: true,
      schedule: true,
    },
  });
  const total = await prisma.appointment.count({
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

const changeAppointmentStatus = async(appointmentId:string, status:AppointmentStatus, user:TAuthUser)=>{
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },  
    include: {
      doctor: true,
    }
  })
  if(user.role === UserRole.DOCTOR && appointmentData.doctor.email !== user.email){
    throw new ApiError( httpStatus.UNAUTHORIZED,"You are not authorized to change the status of this appointment");   
  }
  const result = await prisma.appointment.update({
    where: {
      id: appointmentData.id,
    },
    data:{
      status
    }
  })
  return result;
}

const cancelUnPaidAppointments = async()=>{
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); 
  const unpaidAppointments = await prisma.appointment.findMany({
    where: {
      payment: {
        status: "UNPAID",
      },
      createdAt: {
        lte: thirtyMinutesAgo,
      },
    },
  })

  const appointmentIds = unpaidAppointments.map(appointment => appointment.id);
  const result = await prisma.$transaction(async(tx)=>{
    await tx.payment.deleteMany({
      where:{
        appointmentId: {
          in: appointmentIds,
        },
      }
    })
    await tx.doctorSchedule.updateMany({
      where:{
        appointmentId: {
          in: appointmentIds,
        },
      },
      data:{
        isBooked: false,
      }
    })
    await tx.appointment.deleteMany({
      where:{
        id: {
          in: appointmentIds, 
        }
      }
    })
  })

  console.log(appointmentIds) 

}




export const AppointmentService = {
  createAppointment,
  getMyappointments,
  getAllAppointments,
  changeAppointmentStatus,
  cancelUnPaidAppointments
};
