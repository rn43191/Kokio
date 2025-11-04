export const getEsimOrderPayload = ({
  eSimItem,
  deviceWalletId,
  discountCode,
}) => ({
  deviceId: deviceWalletId,
  catalogueId: eSimItem?.catalogueId,
  amount: eSimItem?.actualSellingPrice,
  currency: "USD", // TODO: check if need to be dyanamic
  isNewESim: true, // True if new esim and false if topup
  coupon: discountCode,
});
