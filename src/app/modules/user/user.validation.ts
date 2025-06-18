import { z } from "zod";
import { Gender } from "../../../../generated/prisma";

const createAdmin = z.object({
  body: z.object({
    password: z.string().min(5, "Password must be at least 5 characters long"),
    admin: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      contactNumber: z.string({ required_error: "Contact number is required" }),
      profilePhoto: z.string().optional(),
    }),
  }),
});

const createDoctor = z.object({
  body: z.object({
    password: z.string().min(5, "Password must be at least 5 characters long"),
    doctor: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      contactNumber: z.string({ required_error: "Contact number is required" }),
      profilePhoto: z.string().optional(),
      address: z.string().optional(),
      registrationNumber: z.string({
        required_error: "Registration number is required",
      }),
      experience: z.number().optional(),
      gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
        required_error: "Gender is required",
      }),
      appointmentFee: z.number({
        required_error: "Appointment fee is required",
      }),
      qualification: z.string({ required_error: "Qualification is required" }),
      currentWorkingPlace: z.string({
        required_error: "Current working place is required",
      }),
      designation: z.string({ required_error: "Designation is required" }),
    }),
  }),
});

const createPatient = z.object({
  body: z.object({
    password: z.string().min(5, "Password must be at least 5 characters long"),
    patient: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      contactNumber: z.string({ required_error: "Contact number is required" }),
      profilePhoto: z.string().optional(),
      address: z.string().optional(),
    }),
  }),
});

export const UserValidationSchema = {
  createAdmin,
  createDoctor,
  createPatient
};
