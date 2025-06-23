import { Patient, Prisma } from "../../../../generated/prisma";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { patientSearchableFields } from "./patient.constant";
import { IPatientFilterRequest } from "./patient.interface";

const getAllPatients = async (
  params: IPatientFilterRequest,
  options: Record<string, unknown>
) : Promise<{data:Patient[], meta:{
  page: number;
  limit: number;
  total: number;
}}>=> {
  const { skip, page, limit, sortOrder, sortBy } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.PatientWhereInput[] = [];
  if (params?.searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
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
  const whereConditions: Prisma.PatientWhereInput = { AND: andConditions };
  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
  });
  const total = await prisma.patient.count({
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

const getPatientById  = async (id:string)=>{
    const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false, 
    },
  });
  return result;
}

const updatePatient = async (patientId: string, payload: Partial<Patient>): Promise<Patient | null> => {
  const isPatientExists = await prisma.patient.findUnique({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });
  if (!isPatientExists) {
    throw new Error("Patient not found");
  }
  const result = await prisma.patient.update({
    where: {
      id: patientId,
    },
    data: payload,
  });
  return result;
};

const deletePatient = async (patientId: string): Promise<Patient| null> => {
  const isAdminExists = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  });
  if (!isAdminExists) {
    throw new Error("Patient not found");
  }
  const result = await prisma.$transaction(async (transactionclient) => {
    const deletedPatient = await transactionclient.patient.delete({
      where: {
        id: patientId,
      },
    });
    await transactionclient.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });
    return deletedPatient;
  });

  return result;
};

const softDeletePatient = async (patientId: string):Promise<Patient |  null> => {
  const isAdminExists = await prisma.patient.findUnique({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });
  if (!isAdminExists) {
    throw new Error("Patient not found");
  }
  const result = await prisma.$transaction(async (transactionclient) => {
    const deletedPatient = await transactionclient.patient.update({
      where: {
        id: patientId,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionclient.user.update({
      where: {
        email: deletedPatient.email,
      },
      data:{
        status:"DELETED"
      }
    });
    return deletedPatient;
  });

  return result;
};


export const PatientService = {
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    softDeletePatient,
}