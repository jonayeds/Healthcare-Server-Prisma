import {  UserRole } from "../../../../generated/prisma"
import bcrypt from "bcrypt"
import prisma from "../../../shared/prisma"
import { fileUploader } from "../../../helpers/uploader"
import { Request } from "express"


const createAdmin = async(req:Request)=>{
    const file = req.file
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.admin.profilePhoto = uploadToCloudinary?.optimizeUrl 
    }
    const data = req.body   
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const userData = {
        email: data.admin.email,
        password:hashedPassword,
        role: UserRole.ADMIN,
    }
    const result = await prisma.$transaction(async (transactionClient)=>{
        const createdUserData = await transactionClient.user.create({
            data:userData
        })
        const createdAdminData = await transactionClient.admin.create({
            data: data.admin
        })
        return {
            user: createdUserData,
            admin: createdAdminData                 
        }
    })
    return result
}


export const UserService = {
    createAdmin
}   