export const RADIO_KEYS = {
  E_SIM_WALLET: "E_SIM_WALLET",
  CREDIT_CARD: "CREDIT_CARD",
  APPLE_PAY: "APPLE_PAY",
};

export const PLAN_TYPES = {
  DATA: "DATA",
  DATA_CALLS_SMS: "DATA_CALLS_SMS",
};

export const PLAN_TYPE_LABELS = {
  [PLAN_TYPES.DATA]: "Data",
  [PLAN_TYPES.DATA_CALLS_SMS]: "Data+Calls+SMS",
};

export const ESIM_EXTRA_DETAILS = [
  {
    iconType: "MCI",
    iconName: "card-text-outline",
    key: "planType",
    label: "Plan Type",
    formatter: (value) => PLAN_TYPE_LABELS[value] || value,
  },
  {
    iconType: "MCI",
    iconName: "plus-box-multiple-outline",
    key: "isTopupAvailable",
    label: "Top-Up Options",
    formatter: (value) => (value ? "Available" : "Not Available"),
  },
  {
    iconType: "MCI",
    iconName: "signal-cellular-outline",
    key: "countryWiseNetworkCoverages",
    label: "Network",
    formatter: (value) =>
      value
        .reduce((acc, item) => {
          const { networks } = item || {};
          return [...acc, ...(networks?.map((network) => network.name) || [])];
        }, [])
        .join(", "),
  },
  {
    iconType: "MCI",
    iconName: "ip-network-outline",
    key: "IP_ROUTING",
    label: "IP Routing",
    formatter: () => "N/A", // NOTE: Not currently received
  },
  {
    iconType: "MCI",
    iconName: "file-check-outline",
    key: "isAutoStart",
    label: "Activation Policy",
    formatter: (value) =>
      value
        ? "The validity period starts when the eSIM connects to any supported network/s."
        : "N/A",
    isFlexColumn: true,
    dataContainerStyles: { marginLeft: 22 },
  },
  // NOTE: Will be false currently
  {
    iconName: "person-circle-outline",
    key: "isKycRequired",
    label: "Identity Verification",
    formatter: (value) => (value ? "Required" : "Not Required"),
    isFlexColumn: true,
    dataContainerStyles: { marginLeft: 22 },
  },
  // NOTE: Not currently consumed
  {
    iconName: "information-outline",
    key: "ADDITIONAL_INFORMATION",
    label: "Additional Information",
    formatter: () => "N/A",
    isFlexColumn: true,
    dataContainerStyles: { marginLeft: 22 },
  },
];
