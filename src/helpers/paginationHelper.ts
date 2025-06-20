type TOptions = {
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
};

type TOptionResult = {
  page: number;
  limit: number;
  skip: number;
  sortOrder: string;
  sortBy: string;
};

const calculatePagination = (options: TOptions): TOptionResult => {
  const page = Number(options?.page) || 1;
  const limit = Number(options?.limit) || 5;
  const skip = (page - 1) * limit;
  const sortOrder = options?.sortOrder || "desc";
  const sortBy = options?.sortBy || "createdAt";
  return {
    skip,
    page,
    limit,
    sortOrder,
    sortBy,
  };
};

export default calculatePagination;
