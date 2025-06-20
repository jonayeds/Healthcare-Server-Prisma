import prisma from "../../../shared/prisma"

const createSpeciality = async(data:any)=>{
    const result = await prisma.speciality.create({
        data
    })
    return result
}

const getAllSpecialities = async()=>{
    const result = await prisma.speciality.findMany()
    return result 
}

const deleteSpeciality = async(id:string)=>{
    const result = await prisma.speciality.delete({
        where:{
            id
        }
    })
    return result       
}

export const SpecialityService = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality  
}