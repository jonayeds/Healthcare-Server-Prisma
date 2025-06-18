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
        const createdDoctorData = await transactionClient.admin.create({
            data: data.admin
        })
        return {
            user: createdUserData,
            admin: createdDoctorData                 
        }
    })
    return result
}
const createDoctor = async(req:Request)=>{
    const file = req.file
    console.log(req.body)
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.doctor.profilePhoto = uploadToCloudinary?.optimizeUrl 
    }
    const data = req.body   
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const userData = {
        email: data.doctor.email,
        password:hashedPassword,
        role: UserRole.DOCTOR,
    }
    const result = await prisma.$transaction(async (transactionClient)=>{
        const createdUserData = await transactionClient.user.create({
            data:userData
        })
        const createdDoctorData = await transactionClient.doctor.create({
            data: data.doctor
        })
        return {
            user: createdUserData,
            doctor: createdDoctorData                 
        }
    })
    return result
}


const createPatient = async(req:Request)=>{
    const file = req.file
    console.log(req.body)
    if(file){
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.patient.profilePhoto = uploadToCloudinary?.optimizeUrl 
    }
    const data = req.body   
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const userData = {
        email: data.patient.email,
        password:hashedPassword,
        role: UserRole.PATIENT,
    }
    const result = await prisma.$transaction(async (transactionClient)=>{
        const createdUserData = await transactionClient.user.create({
            data:userData
        })
        const createdDoctorData = await transactionClient.patient.create({
            data: data.patient
        })
        return {
            user: createdUserData,
            patient: createdDoctorData                 
        }
    })
    return result
}


export const UserService = {
    createAdmin,
    createDoctor,
    createPatient,
}   