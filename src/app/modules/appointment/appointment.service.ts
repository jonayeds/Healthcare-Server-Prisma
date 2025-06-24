import prisma from "../../../shared/prisma"
import { TAuthUser } from "../../interfaces/common"
import { v4 as uuidv4 } from 'uuid';

const createAppointment = async(user:TAuthUser, payload:any)=>{
    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
            isDeleted: false
        }
    })
    console.log(payload)
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    })      
    const doctorScheduleInfo = await prisma.doctorSchedule.findUniqueOrThrow({
        where: {
            doctorId_scheduleId:{
                doctorId: doctorInfo.id,
                scheduleId: payload.scheduleId  
            },
            isBooked: false 
        }
    })
    const videoCallingId = uuidv4();
    const result = await prisma.$transaction(async(tx)=>{
        const appointment = await prisma.appointment.create({
            data:{
                patientId: patientInfo.id,
                doctorId: doctorInfo.id,
                scheduleId: doctorScheduleInfo.scheduleId,
                videoCallingId,
            }
        })   
        await tx.doctorSchedule.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorInfo.id,
                    scheduleId: doctorScheduleInfo.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appointment.id
            }
        })
        return appointment
    })
    return result
}

export const AppointmentService ={
    createAppointment
}