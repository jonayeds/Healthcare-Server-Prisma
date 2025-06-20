import { z } from "zod";

const createSpeciality = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),      
    })
})

export const SpecialityValidationSchema = {
    createSpeciality
}