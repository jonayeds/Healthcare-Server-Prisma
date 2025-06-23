export interface ISchedule {
    startDate: string;
    endDate: string;
    startTime:string;
    endTime: string;
}

export interface IFilterRequest {
    startDate?: string;
    endDate?: string;
    startDateTime?: string;
    endDateTime?: string;
    myAvailableSlots?: string;
}