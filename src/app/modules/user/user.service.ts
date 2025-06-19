import { Prisma, User, UserRole, UserStatus } from "../../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/uploader";
import { Request } from "express";
import calculatePagination from "../../../helpers/paginationHelper";
import { userSearchableFilds } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";

const createAdmin = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.optimizeUrl;
  }
  const data = req.body;
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });
    const createdDoctorData = await transactionClient.admin.create({
      data: data.admin,
    });
    return {
      user: createdUserData,
      admin: createdDoctorData,
    };
  });
  return result;
};
const createDoctor = async (req: Request) => {
  const file = req.file;
  console.log(req.body);
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.optimizeUrl;
  }
  const data = req.body;
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userData = {
    email: data.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });
    const createdDoctorData = await transactionClient.doctor.create({
      data: data.doctor,
    });
    return {
      user: createdUserData,
      doctor: createdDoctorData,
    };
  });
  return result;
};

const createPatient = async (req: Request) => {
  const file = req.file;
  console.log(req.body);
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadToCloudinary?.optimizeUrl;
  }
  const data = req.body;
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userData = {
    email: data.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: userData,
    });
    const createdDoctorData = await transactionClient.patient.create({
      data: data.patient,
    });
    return {
      user: createdUserData,
      patient: createdDoctorData,
    };
  });
  return result;
};

const getAllUsers = async (
  params: any,
  options: Record<string, unknown>
) : Promise<{data:Pick<User, "id" | "email" | "role" | "status" | "createdAt" | "updatedAt">[], meta:{
  page: number;
  limit: number;
  total: number;
}}>=> {
  const { skip, page, limit, sortOrder, sortBy } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];
  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchableFilds.map((field) => ({
        [field]: {
          contains: params.searchTerm as string,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
    select:{
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,    
        updatedAt: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeProfileStatus = async(id:string, data:{status:UserStatus})=>{
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            id
        }
    })
    const updateUserStatus = await prisma.user.update({
        where:{
            id
        },
        data:{
            status: data.status
        }
    })
    return updateUserStatus
}

const getMyProfile = async(user:any)=>{
    const userInfo = await prisma.user.findUniqueOrThrow({
        where:{
            email: user.email,
            status: UserStatus.ACTIVE       
        },
        select:{
            [user.role === UserRole.SUPER_ADMIN ? 'admin': user.role.toLowerCase()]: true,
            id: true,
            email: true,
            role: true, 
            needPasswordChange: true,
            status: true,   
            createdAt: true,    
            updatedAt: true,    
        }
    })
    return userInfo
}

const updateMyProfile = async(user:JwtPayload, payload:any)=>{
    const userInfo = await prisma.user.findUniqueOrThrow({
        where:{
            email: user.email,
            status: UserStatus.ACTIVE   
        },
    })
    let profileInfo;
    if(userInfo.role === UserRole.SUPER_ADMIN || userInfo.role === UserRole.ADMIN){
         profileInfo = await prisma.admin.update({
            where:{
                email: userInfo.email,
            },
            data: payload
        })
    }
    else if(userInfo.role === UserRole.DOCTOR){
        profileInfo = await prisma.doctor.update({
            where:{
                email: userInfo.email,
            },
            data: payload
        })
    }
    else if(userInfo.role === UserRole.PATIENT){
        profileInfo = await prisma.patient.update({
            where:{
                email: userInfo.email,
            },
            data: payload
        })
    }
    return profileInfo

}

export const UserService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile
};
