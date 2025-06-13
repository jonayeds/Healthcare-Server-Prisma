import { Prisma, PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

const getAllAdmins = async (params: Record<string, unknown>) => {
  const andConditions:Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: params.searchTerm as string,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: params.searchTerm as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
  });
  return result;
};

export const AdminService = {
  getAllAdmins,
};
