import { z } from "zod";

const createAppointment = z.object({
   body:z.object({
    doctorId: z.string({}).min(1, "Doctor ID is required"),
    scheduleId: z.string({}).min(1, "Schedule ID is required"),         
   }) 
})

export const AppointmentValidation = {
    createAppointment
}