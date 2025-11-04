import api from "./httpService";

const API_PATHS = {
  FETCH_ESIMS: "/v1/catalogue",
  ORDER: "/v1/order",
  VALIDATE_COUPON: (couponCode) => `/v1/coupon/${couponCode}`,
};

export const fetchEsimsCatalogue = (payload) =>
  api.get(API_PATHS.FETCH_ESIMS, payload);

export const eSimOderCheckout = (payload) => api.post(API_PATHS.ORDER, payload);

export const validateCoupon = (couponCode) =>
  api.get(API_PATHS.VALIDATE_COUPON(couponCode));
