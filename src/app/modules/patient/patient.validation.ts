import { z } from "zod";

const healthData = z.object({
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    dateOfBirth: z.string().optional(),
    bloodGroup: z.enum(["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"]).optional(),
    hasAllergies: z.boolean().optional(),
    hasDiabetes: z.boolean().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    smokingStatus: z.boolean().optional(),
    dietaryPreferences: z.string().optional(),
    pregnancyStatus: z.boolean().optional(),
    mentalHealthStatus: z.string().optional(),
    immunizationStatus: z.string().optional(),
    hasPastSergeries: z.boolean().optional(),
    recentAnxity: z.boolean().optional(),
    recentDepression: z.boolean().optional(),
    maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
})

const medicalReport = z.object({
    reportName: z.string().min(1, "Report name is required"),   
    // reportLink: z.string().url("Invalid URL format"), 
    reportLink: z.string().min(1, "Report link is required"),        
})

const updatePatient  = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber :z.string().optional(),
        address: z.string().optional(), 
        healthData: healthData.optional(),
        medicalReport: medicalReport.optional(),
    })
})



export const patientValidationSchema = {
    updatePatient
}