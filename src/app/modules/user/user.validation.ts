import { z } from "zod";
import { Gender, UserStatus } from "../../../../generated/prisma";

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

const updateUserStatus = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED], {required_error: "Status is required"}),  
  })
})

const updateMyProfileSchemaAdmin = z.object({
  body:z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(), 
  })
})
const updateMyProfileSchemaPatient = z.object({
  body:z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(), 
    address: z.string().optional(), 
  })
})
const updateMyProfileSchemaDoctor = z.object({
  body:z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(), 
    address: z.string().optional(), 
    experience: z.number().optional(),  
    appointmentFee: z.number().optional(),
    qualification: z.string().optional(), 
    currentWorkingPlace: z.string().optional(), 
    designation: z.string().optional(),   
  })
})

export const UserValidationSchema = {
  createAdmin,
  createDoctor,
  createPatient,
  updateUserStatus,
  updateMyProfileSchemaAdmin,
  updateMyProfileSchemaPatient,
  updateMyProfileSchemaDoctor
};
