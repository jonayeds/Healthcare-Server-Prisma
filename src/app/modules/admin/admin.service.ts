import { Admin, Prisma } from "../../../../generated/prisma";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { adminSearchableFields } from "./admin.constant";
import { IAdminFilterRequest } from "./admin.interface";

const getAllAdmins = async (
  params: IAdminFilterRequest,
  options: Record<string, unknown>
) : Promise<{data:Admin[], meta:{
  page: number;
  limit: number;
  total: number;
}}>=> {
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
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  andConditions.push({
    isDeleted:false
  })
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

const getAdminById = async (adminId: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id: adminId,
      isDeleted: false, 
    },
  });
  return result;
};

const updateAdmin = async (adminId: string, payload: Partial<Admin>): Promise<Admin | null> => {
  const isAdminExists = await prisma.admin.findUnique({
    where: {
      id: adminId,
      isDeleted: false,
    },
  });
  if (!isAdminExists) {
    throw new Error("Admin not found");
  }
  const result = await prisma.admin.update({
    where: {
      id: adminId,
    },
    data: payload,
  });
  return result;
};

const deleteAdmin = async (adminId: string): Promise<Admin| null> => {
  const isAdminExists = await prisma.admin.findUnique({
    where: {
      id: adminId,
    },
  });
  if (!isAdminExists) {
    throw new Error("Admin not found");
  }
  const result = await prisma.$transaction(async (transactionclient) => {
    const deletedAdmin = await transactionclient.admin.delete({
      where: {
        id: adminId,
      },
    });
    await transactionclient.user.delete({
      where: {
        email: deletedAdmin.email,
      },
    });
    return deletedAdmin;
  });

  return result;
};

const softDeleteAdmin = async (adminId: string):Promise<Admin |  null> => {
  const isAdminExists = await prisma.admin.findUnique({
    where: {
      id: adminId,
      isDeleted: false,
    },
  });
  if (!isAdminExists) {
    throw new Error("Admin not found");
  }
  const result = await prisma.$transaction(async (transactionclient) => {
    const deletedAdmin = await transactionclient.admin.update({
      where: {
        id: adminId,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionclient.user.update({
      where: {
        email: deletedAdmin.email,
      },
      data:{
        status:"DELETED"
      }
    });
    return deletedAdmin;
  });

  return result;
};

export const AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
