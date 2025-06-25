import { AppointmentStatus, Prescription } from "../../../../generated/prisma"
import prisma from "../../../shared/prisma"
import { TAuthUser } from "../../interfaces/common"

const createPrescription = async(payload:Partial<Prescription>, user:TAuthUser)=>{
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where:{
            id: payload.appointmentId,
            status:AppointmentStatus.COMPLETED,
            doctor:{
                email: user.email,
            }
        },
    })

    const result = await prisma.prescription.create({
        data: {
            appointmentId: payload.appointmentId as string,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload?.followUpDate || null,
        }
    })
    return result
}

export const PrescriptionService = {
    createPrescription
}