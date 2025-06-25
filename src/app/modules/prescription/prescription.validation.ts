import { z } from "zod";

const createPrescription = z.object({
    body: z.object({
        appointmentId: z.string().min(1, "Appointment ID is required"),
        instructions: z.string().min(1, "Instructions are required"),
        followUpDate: z.string().optional(),        
    })
})

export const PrescriptionValidation = {
    createPrescription
}