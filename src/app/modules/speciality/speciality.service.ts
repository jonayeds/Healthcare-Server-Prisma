import prisma from "../../../shared/prisma"

const createSpeciality = async(data:any)=>{
    const result = await prisma.speciality.create({
        data
    })
    return result
}

export const SpecialityService = {
    createSpeciality
}