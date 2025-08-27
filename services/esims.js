import api from "./httpService";

const API_PATHS = {
  FETCH_ESIMS: "/v1/catalogue",
  ORDER: "/v1/ordersssss", // TODO: Endpoint correction
};

export const fetchEsimsCatalogue = (payload) =>
  api.get(API_PATHS.FETCH_ESIMS, payload);

export const eSimOderCheckout = (payload) => api.post(API_PATHS.ORDER, payload);
