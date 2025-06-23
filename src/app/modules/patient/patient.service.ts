import { report } from "process";
import {
  MedicalReport,
  Patient,
  PatientHealthdata,
  Prisma,
} from "../../../../generated/prisma";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { patientSearchableFields } from "./patient.constant";
import { IPatientFilterRequest } from "./patient.interface";

const getAllPatients = async (
  params: IPatientFilterRequest,
  options: Record<string, unknown>
): Promise<{
  data: Patient[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}> => {
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
    isDeleted: false,
  });
  const whereConditions: Prisma.PatientWhereInput = { AND: andConditions };
  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    },
    include: {
      healthData: true,
      medicalReport: true,
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

const getPatientById = async (id: string) => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      healthData: true,
      medicalReport: true,
    },
  });
  return result;
};

const updatePatient = async (
  patientId: string,
  payload: Partial<
    Patient & {
      healthData:
        | Prisma.PatientHealthdataCreateInput
        | Prisma.PatientHealthdataUpdateInput
        | null;
      medicalReport: MedicalReport | undefined;
    }
  >
): Promise<Patient | null> => {
  const isPatientExists = await prisma.patient.findUnique({
    where: {
      id: patientId,
      isDeleted: false,
    },
  });
  if (!isPatientExists) {
    throw new Error("Patient not found");
  }
  const { healthData, medicalReport, ...patientData } = payload;
  await prisma.$transaction(async (tx) => {
    const updatedPatient = await tx.patient.update({
      where: {
        id: patientId,
      },
      data: patientData,
    });
    //   create Or update health Data
    if (healthData) {
      await tx.patientHealthdata.upsert({
        where: {
          patientId: isPatientExists.id,
        },
        update: healthData,
        create: {
          patient: { connect: { id: isPatientExists.id } },
          gender: healthData?.gender || "OTHER",
          dateOfBirth: healthData?.dateOfBirth || "2000-01-01",
          height: healthData?.height || "0cm",
          weight: healthData?.weight || "0kg",
          bloodGroup: healthData?.bloodGroup || "O_POSITIVE",
          ...healthData,
        } as Prisma.PatientHealthdataCreateInput,
      });
    }
    //   create  medical report
    if (medicalReport) {
      const report  = await tx.medicalReport.create({
        data: {
          ...medicalReport,
          patientId: isPatientExists.id,
        },
      });
    }

    return updatedPatient;
  });
  const responseData = await prisma.patient.findUnique({
    where: {
      id: patientId,
      isDeleted: false,
    },
    include: {
      healthData: true,
      medicalReport: true,
    },  
  });
  return responseData;
};

const deletePatient = async (patientId: string): Promise<Patient | null> => {
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

const softDeletePatient = async (
  patientId: string
): Promise<Patient | null> => {
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
      data: {
        status: "DELETED",
      },
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
};
