import { z } from "zod";

const createAdmin = z.object({
    body:z.object({
        password:z.string().min(5, "Password must be at least 5 characters long"),     
        admin: z.object({
            name: z.string().min(1, "Name is required"),    
            email: z.string().email("Invalid email format"),
            contactNumber: z.string({required_error: "Contact number is required"}), 
            profilePhoto: z.string().optional(),
        }) 
    })
})

export const UserValidationSchema = {
    createAdmin
}