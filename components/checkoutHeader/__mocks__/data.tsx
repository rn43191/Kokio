// TODO: Remove Mock
export const MOCK_ESIM_DATA = {
  id: "1",
  country: "Italy",
  isoCode: "it",
  duration: 3,
  data: 1.7,
  minutes: 52,
  sms: 27,
  price: 6.5,
  flagColor: "#008C45",
};

// TODO: Remove Mock
export const MOCK_DETAIL_ITEMS = [
  {
    iconType: "MCI",
    iconName: "card-text-outline",
    value: "Plan Type",
    data: "Data+Calls+SMS",
  },
  {
    iconType: "MCI",
    iconName: "plus-box-multiple-outline",
    value: "Top-Up Options",
    data: "Available",
  },
  {
    iconType: "MCI",
    iconName: "signal-cellular-outline",
    value: "Network",
    data: "T-Mobile, Verizon",
  },
  {
    iconType: "MCI",
    iconName: "ip-network-outline",
    value: "IP Routing",
    data: "No",
  },
  {
    iconType: "MCI",
    iconName: "file-check-outline",
    value: "Activation Policy",
    data: "The validity period starts when the eSIM connects to any supported network/s.",
    isFlexColumn: true,
    dataContainerStyles: { marginLeft: 22 },
  },
  {
    iconName: "person-circle-outline",
    value: "Identity Verification",
    data: "Not Required",
    isFlexColumn: true,
    dataContainerStyles: { marginLeft: 22 },
  },
  {
    iconName: "information-outline",
    value: "Additional Information",
    data: "This eSIM is for travelers to Italy. The coverage applies to all 20 regions of Italy",
    isFlexColumn: true,
    dataContainerStyles: { marginLeft: 22 },
  },
];
