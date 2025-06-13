import { Prisma, PrismaClient } from "../../../../generated/prisma";
import calculatePagination from "../../../helpers/paginationHelper";
import { adminSearchableFields } from "./admin.constant";

const prisma = new PrismaClient();

const getAllAdmins = async (
  params: Record<string, unknown>,
  options: Record<string, unknown>
) => {
 const { skip, limit, sortOrder, sortBy } = calculatePagination(options);
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
  return result;
};

export const AdminService = {
  getAllAdmins,
};
