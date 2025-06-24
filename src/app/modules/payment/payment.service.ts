import prisma from "../../../shared/prisma";
import { SslService } from "../ssl/ssl.service";
import { PaymentStatus } from "../../../../generated/prisma";

const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findUniqueOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });
  const initPaymentData = {
    amount: paymentData.amount,
    customerName: paymentData.appointment.patient.name,
    customerEmail: paymentData.appointment.patient.email,
    customerAddress: paymentData.appointment.patient.address,
    customerContact: paymentData.appointment.patient.contactNumber,
    transactionId: paymentData.transactionId,
  };

  const result = await SslService.initPayment(initPaymentData);
  console.log(result.GatewayPageURL);
  return {
    paymentUrl: result.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  // if(!payload || (payload.status !== 'VALID')){
  //     return {
  //         message: "Invalid Payment"
  //     }
  // }

  // const response = await SslService.validatePayment(payload);
  // if(response.status !== 'VALID'){
  //     return {
  //         message: "Payment Validation Failed"
  //     }
  // }
  const response = payload;
  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });
    await tx.appointment.update({
      where: {
        id: updatedPayment.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
    return { message: "Payment Validated Successfully" };
  });
  return result;
};

export const PaymentService = {
  initPayment,
  validatePayment,
};
