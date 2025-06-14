import { Prisma } from "../../../../generated/prisma";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { adminSearchableFields } from "./admin.constant";

const getAllAdmins = async (
  params: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { skip, page, limit, sortOrder, sortBy } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];
  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
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
          equals: filterData[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
  });
  const total = await prisma.admin.count({
    where: whereConditions,
  })
  return {
    meta: {
      page,
      limit,
      total
    },
    data:result,
  };
};

const getAdminById = async(adminId:string)=>{
  const result = await prisma.admin.findUnique({
    where:{
      id: adminId,
    }
  })
  return result
}

export const AdminService = {
  getAllAdmins,
  getAdminById,
};
