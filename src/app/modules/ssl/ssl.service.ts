import axios from "axios";
import config from "../../../config";
import { ApiError } from "../../errors/ApiError";
import httpStatus from "http-status";
import { IPaymentData } from "./ssl.interface";

const initPayment = async (initPaymentData: IPaymentData) => {
  try {
    const data = {
      store_id: config.ssl.store_id,
      store_passwd: config.ssl.store_pass,
      total_amount: initPaymentData.amount,
      currency: "BDT",
      tran_id: initPaymentData.transactionId,
      success_url: config.ssl.success_url,
      fail_url: config.ssl.fail_url,
      cancel_url: config.ssl.cancel_url,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Appointment Fee",
      product_category: "Service",
      product_profile: "general",
      cus_name: initPaymentData.customerName,
      cus_email: initPaymentData.customerEmail,
      cus_add1: initPaymentData.customerAddress,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: initPaymentData.customerContact,
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };
    const response = await axios({
      method: "post",
      url: config.ssl.ssl_payment_api,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to initialize payment");
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "get",
      url: `${config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_passwd=${config.ssl.store_pass}&format=json`,
    });
    return response.data;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment validation failed");
  }
};

export const SslService = {
  initPayment,
  validatePayment,
};
