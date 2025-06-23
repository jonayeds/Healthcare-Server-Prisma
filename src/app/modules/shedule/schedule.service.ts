import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { ISchedule } from "./schedule.interface";
import { Schedule } from "../../../../generated/prisma";

const createSchedule = async(payload:ISchedule): Promise<Schedule[] | null>=>{
    const {startDate, endDate, startTime, endTime} = payload
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    const scheduleData = []
    while (currentDate <= lastDate) {
        let startDateTime = new Date(
            addMinutes(addHours(
                `${format(currentDate, "yyyy-MM-dd")}`,
                Number(startTime.split(":")[0])
             ), Number(startTime.split(":")[1])),
        )
        let endDateTime = new Date(
            addMinutes(addHours(
                `${format(currentDate, "yyyy-MM-dd")}`,
                Number(endTime.split(":")[0])
             ), Number(endTime.split(":")[1])),
        )
        
        while (startDateTime < endDateTime) {
            scheduleData.push({
                startDateTime,
                endDateTime: addHours(startDateTime, 0.5)
            })
            startDateTime = addHours(startDateTime, 0.5);
        }
        currentDate = addHours(currentDate, 24);
    }
    const result = await prisma.schedule.createManyAndReturn({
        data: scheduleData,
        skipDuplicates: true, 
    })
    if(result.length === 0){
        throw new Error("Schedule already exists for the given date range and time");   
    }
    return result
}



export const ScheduleService = {
    createSchedule
}