import { resolveObjectURL } from "node:buffer";
import { Doctor, Prisma, UserStatus } from "../../../../generated/prisma";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { ApiError } from "../../errors/ApiError";
import { doctorFilterableFields, doctorSearchableFields } from "./doctor.constant";
import { IDoctorFilterRequest } from "./doctor.interface";
import httpStatus from "http-status";

const getAllDoctors = async (
  filter: IDoctorFilterRequest,
  pagination: Record<string, unknown>
): Promise<{
  data: Doctor[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}> => {

  const { skip, page, limit, sortOrder, sortBy } =
    calculatePagination(pagination);
  const { searchTerm, specialities, ...filterData } = filter;
  const andConditions: Prisma.DoctorWhereInput[] = [];
  if (filter?.searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: filter.searchTerm as string,
          mode: "insensitive",
        },
      })),
    });
  }

  if(specialities && specialities.length > 0){
    andConditions.push({
      specialities:{
        some:{
          speciality:{
            title:{
              contains:specialities,
              mode: "insensitive",  
            }
          }
        }
      }
    })
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
  andConditions.push({
    isDeleted: false,
  });
  // console.dir(andConditions, {depth: Infinity})
  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };
  const result = await prisma.doctor.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
    skip,
    take: limit,
    include: {
      specialities:{
        select: {
          speciality: true,
        },
      },
    }
  });
  const total = await prisma.doctor.count();
  return {
    data: result,
    meta: {
      total,
      limit,
      page,
    },
  };
};

const getDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      // isDeleted: false,
    },
    include: {
      specialities: true,
    },
  });
  return result;
};

const deleteDoctor = async (id: string) => {
  const isexists = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!isexists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  const result = await prisma.doctor.delete({
    where: {
      id,
    },
  });
  return result;
};

const softDeleteDoctor = async (id: string) => {
  const isexists = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!isexists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  }
  const result = await prisma.$transaction(async (tx) => {
    const doctorData = await tx.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    const userdata = await tx.user.update({
      where: {
        email: isexists.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return { doctor: doctorData, user: userdata };
  });
  return result;
};

const updateDoctor = async (id: string, data: any) => {
  const { specialities, ...doctorData } = data;
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  await prisma.$transaction(async (tx) => {
     await tx.doctor.update({
      where: {
        id,
      },
      data: {
        ...doctorData,
      },
    });
    if(!specialities?.length) return
    for (const speciality of specialities) {
      if(!speciality.isDeleted){
        await tx.doctorSpeciality.create({
          data: {
            doctorId: doctorInfo.id,
            specialityId: speciality.specialityId,
          },
        });
      }else{
        await tx.doctorSpeciality.delete({
          where: {
            doctorId_specialityId: {
              doctorId: doctorInfo.id,
              specialityId: speciality.specialityId,
            },
          },
        });
      }
    }
  });
  const result = await prisma.doctor.findUnique({
    where:{
      id,
    },
    include:{
      specialities: {
        select:{
          speciality:true
        }
      },
    }
  })
  return result;
};

export const DoctorService = {
  getAllDoctors,
  deleteDoctor,
  softDeleteDoctor,
  getDoctorById,
  updateDoctor,
};
