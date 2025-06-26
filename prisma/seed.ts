import { UserRole } from "../generated/prisma"
import prisma from "../src/shared/prisma"
import bcrypt from "bcrypt"

const seedSuperAdmin = async()=>{
    try {
        const superAdmin = await prisma.user.findFirst({
            where: {
                role: UserRole.SUPER_ADMIN
            }
        })
        if (superAdmin) {
            console.log("Super Admin already exists")
            return
        } 
        const password =  await bcrypt.hash("superadmin", 10)  
        const result = await prisma.$transaction(async(tx)=>{
            const user = await tx.user.create({
                data: {
                    email:"super@admin.com",
                    password,
                    role: UserRole.SUPER_ADMIN,
                    admin:{
                        create:{
                            name: "Super Admin",
                            contactNumber: "01700000000",
                        }
                    }
                }
            })
            return user
        })
        console.log("Super Admin created successfully", result)
    } catch (error) {
        console.log(error)
    } finally {
        await prisma.$disconnect();
    }
}

seedSuperAdmin()