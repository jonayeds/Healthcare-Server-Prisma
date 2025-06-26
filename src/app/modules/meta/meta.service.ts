import { UserRole } from "../../../../generated/prisma";
import prisma from "../../../shared/prisma";
import { ApiError } from "../../errors/ApiError";
import { TAuthUser } from "../../interfaces/common";
import httpStatus from "http-status";

const fetchDashboardData = async (user: TAuthUser) => {
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return getSuperAdminMetaData();
    case UserRole.ADMIN:
      return getAdminMetaData();
    case UserRole.DOCTOR:
      return getDoctorMetaData(user.email);
    case UserRole.PATIENT:
      return getPatientMetaData(user.email);
    default:
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You are not authorized to access this resource"
      );
  }
};
const getSuperAdminMetaData = async () => {
    const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const adminCount = await prisma.admin.count();    
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "PAID",
    },
  });
  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    adminCount,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
};
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "PAID",
    },
  });
  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
};

const getDoctorMetaData = async (doctorEmail:string) => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: doctorEmail
        },
    })
    const scheduleCount = await prisma.doctorSchedule.count({
        where:{
            doctorId: doctor.id
        }
    })
    const appointmentCount = await prisma.appointment.count({
        where: {
            doctorId: doctor.id
        }
    })
    const patientCount = await prisma.appointment.groupBy({
        by: ['patientId'],
        where: {
            doctorId: doctor.id
        }
    })
    const reviewCount = await prisma.review.count({
        where: {
            doctorId: doctor.id
        }
    })
    const totalRevenue = await prisma.payment.aggregate(
        {
            _sum: {
                amount: true
            },
            where: {
                appointment: {
                    doctorId: doctor.id,
                }
            }   
        }
    )
    const appointmentStatus = await prisma.appointment.groupBy({
        by:["status"],
        where:{
            doctorId: doctor.id
        },
        _count:{
            id: true
        }
    })
    const formatedAppointmentStatus  = appointmentStatus.map(status => ({
        count:status._count.id,
        status: status.status   
    }))


    return {
        scheduleCount,
        appointmentCount,
        patientCount: patientCount.length, 
        reviewCount,
        totalRevenue: totalRevenue._sum.amount || 0,
        appointmentStatus: formatedAppointmentStatus
    }
};

const getPatientMetaData = async (patientEmail:string) => {
        const patient = await prisma.patient.findUniqueOrThrow({
        where: {
            email: patientEmail
        },
    })
    const appointmentCount = await prisma.appointment.count({
        where: {
            patientId: patient.id
        }
    })
    const doctorCount = await prisma.appointment.groupBy({
        by: ['doctorId'],
        where: {
            patientId: patient.id
        }
    })
    const prescriptionCount = await prisma.prescription.count({
        where:{
            patientId:patient.id
        }
    })
    const reviewCount = await prisma.review.count({
        where: {
            patientId: patient.id
        }
    })
    const totalSpent = await prisma.payment.aggregate(
        {
            _sum: {
                amount: true
            },
            where: {
                appointment: {
                    patientId: patient.id,
                }
            }   
        }
    )
    const appointmentStatus = await prisma.appointment.groupBy({
        by:["status"],
        where:{
            patientId: patient.id
        },
        _count:{
            id: true
        }
    })
    const formatedAppointmentStatus  = appointmentStatus.map(status => ({
        count:status._count.id,
        status: status.status   
    }))
    return {
        appointmentCount,
        doctorCount: doctorCount.length, 
        prescriptionCount,
        reviewCount,
        totalSpent: totalSpent._sum.amount || 0,
        appointmentStatus: formatedAppointmentStatus    
    }
};

export const MetaService = {
  fetchDashboardData,
};
