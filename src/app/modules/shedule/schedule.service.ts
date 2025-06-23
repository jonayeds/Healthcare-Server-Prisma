import { addHours, format } from "date-fns";
import prisma from "../../../shared/prisma";

const createSchedule = async(payload:any)=>{
    const {startDate, endDate, startTime, endTime} = payload
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    const scheduleData = []
    while (currentDate <= lastDate) {
        let startDateTime = new Date(
            addHours(
                `${format(currentDate, "yyyy-MM-dd")}`,
                Number(startTime.split(":")[0])
             ),
        )
        let endDateTime = new Date(
            addHours(
                `${format(currentDate, "yyyy-MM-dd")}`,
                Number(endTime.split(":")[0])
             ),
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
    return result
}

export const ScheduleService = {
    createSchedule
}