import api from "./httpService";

const API_PATHS = {
  BOOTSTRAP: "/v1/catalogue/service-regions",
};

export const fetchBootstrapDataAPI = () => api.get(API_PATHS.BOOTSTRAP);
