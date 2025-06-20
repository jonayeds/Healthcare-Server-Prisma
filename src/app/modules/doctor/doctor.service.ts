import { Doctor, Prisma } from "../../../../generated/prisma";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma"
import { doctorFilterableFields } from "./doctor.constant";
import { IDoctorFilterRequest } from "./doctor.interface";

const getAllDoctors = async (filter:IDoctorFilterRequest, pagination:Record<string, unknown>): Promise<{data:Doctor[], meta:{
  page: number;
  limit: number;
  total: number;
}}> => {
    const { skip, page, limit, sortOrder, sortBy } = calculatePagination(pagination);
    const { searchTerm, ...filterData } = filter;
    const andConditions: Prisma.DoctorWhereInput[] = [];
      if (filter?.searchTerm) {
        andConditions.push({
          OR: doctorFilterableFields.map((field) => ({
            [field]: {
              contains: filter.searchTerm as string,
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
    andConditions.push({
    isDeleted:false
  })
  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };
    const result = await prisma.doctor.findMany({
        where: whereConditions,
        orderBy:{
            [sortBy]: sortOrder === "asc" ? "asc" : "desc"    
        },
        skip,
        take: limit,
    })
    const total = await prisma.doctor.count()
    return {
        data:result,
        meta:{
            total,
            limit,
            page     
        }
}
}

export const DoctorService = {
    getAllDoctors
}