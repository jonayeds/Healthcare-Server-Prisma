import prisma from "../../../shared/prisma"

const createDoctorSchedule = async(payload:{schedules:string[]}, user:any)=>{
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email,
            isDeleted: false,
        }
    })
    const doctorScheduleData = payload?.schedules?.map((sch:string)=>({
        doctorId: doctorInfo.id,
        scheduleId: sch,     
    }))
    const createdDoctorSchedule = await prisma.doctorSchedule.createManyAndReturn({
        data: doctorScheduleData,
        skipDuplicates: true, 
    })
    return createdDoctorSchedule

}

export const DoctorScheduleService= {
    createDoctorSchedule
}