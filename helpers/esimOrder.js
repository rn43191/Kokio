import { uuid } from "@/utils/general";

export const getEsimOrderPayload = ({ eSimItem }) => ({
  deviceId: uuid(),
  catalogueId: eSimItem?.catalogueId,
  amount: eSimItem?.actualSellingPrice,
  currency: "USD", // TODO: check if need to be dyanamic
  isNewESim: true, // True if new esim and false if topup
});
