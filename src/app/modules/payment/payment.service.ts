import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { SslService } from "../ssl/ssl.service";



const initPayment =async(appointmentId:string)=>{
    const paymentData = await prisma.payment.findUniqueOrThrow({
        where:{
            appointmentId,
        },
        include:{
            appointment:{
                include:{
                    patient:true
                }
            }
        }
    })
    const initPaymentData = {
        amount: paymentData.amount,
        customerName: paymentData.appointment.patient.name,
        customerEmail: paymentData.appointment.patient.email,
        customerAddress: paymentData.appointment.patient.address,
        customerContact: paymentData.appointment.patient.contactNumber,     
        transactionId: paymentData.transactionId,
    }

    const result = await SslService.initPayment(initPaymentData)
    console.log(result.GatewayPageURL)
    return {
        paymentUrl: result.GatewayPageURL,  
    }
}

export const PaymentService = {
    initPayment,
}