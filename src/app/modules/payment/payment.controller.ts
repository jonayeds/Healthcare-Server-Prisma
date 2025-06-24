import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const initPayment = catchAsync(async(req, res)=>{
    const result = await PaymentService.initPayment(req.params.appointmentId)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment initialized successfully",
        data: result            
    })
})

export const PaymentController = {
    initPayment
}