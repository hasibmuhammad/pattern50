export type UserInfoType = {
  auth: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    _id: string;
    created_by: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyIds: any[];
    userRoleId: string;
    lastLogin: string;
    deactivationDate: any;
    verificationCode: string;
    registrationType: string;
    userType: string;
    status: string;
    clientId: string;
    resetCode: any;
    isRegistered: boolean;
    isVerified: boolean;
    isDeleted: boolean;
    stripeCustomerId: string;
    created_at: string;
    updated_at: string;
    __v: number;
    image: string;
    scopes: string[];
    roleType: string;
  };
  status: number;
  statusText: string;
  headers: { "content-type": string };
  config: {
    transitional: {
      silentJSONParsing: boolean;
      forcedJSONParsing: boolean;
      clarifyTimeoutError: boolean;
    };
    adapter: string[];
    transformRequest: any[];
    transformResponse: any[];
    timeout: number;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
    maxBodyLength: number;
    env: {};
    headers: { Accept: string; "Content-Type": string; Authorization: string };
    method: string;
    url: string;
    data: string;
  };
  request: {};
};

export type CompanyInfoType = {
  count: number;
  _id: string;
  created_by: string;
  name: string;
  email: string;
  masterEmail: string;
  phone: string;
  userId?: string;
  ein: string;
  addressId: string;
  clientId: string;
  billingInfoId: string;
  status: string;
  acc_contactId?: string;
  created_at: string;
  updated_at: string;
  startDate: string;
  endDate: string;
  __v: number;
  addresses: {
    _id: string;
    created_by: string;
    addressLine: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    status: string;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  address: {
    _id: string;
    created_by: string;
    addressLine: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    status: string;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  billingInfo: {
    startDate: string;
    endDate: string;
  };

  activityLogs: {
    fieldName: string;
    prevValue: string;
    currValue: string;
    created_by: string;
    date: string;
  }[];
  productsCount: number;
};

export type ProductsInfo = {
  _id: string;
  created_by: string;
  name: string;
  details: string;
  clientId: string;
  companyId: string;
  inv_generationDate: any;
  created_at: string;
  updated_at: string;
  __v: number;
  company: {
    _id: string;
    created_by: string;
    name: string;
    email: string;
    masterEmail: string;
    phone: string;
    userId: string;
    ein: string;
    addressId: string;
    clientId: string;
    billingInfoId: string;
    status: string;
    acc_contactId: string;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  contract: {
    _id: string;
    created_by: string;
    name: string;
    terminationReason: any;
    safeAgreementAmount?: number;
    valuationCapitalAmount?: number;
    discount?: number;
    clientId: string;
    productId: string;
    rateSheetId: string;
    status: string;
    startDate: string;
    endDate: any;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  count: number;
};

export type TechnologyCategoryType = {
  _id: string;
  created_by: string;
  name: string;
  website: string;
  logo: string;
  logoKey: string;
  logoName: string;
  status: string;
  categoryId: string;
  typeId: string;
  clientId: string;
  created_at: string;
  updated_at: string;
  __v: number;
  type: string;
  count: number;
};

export type Tool = {
  _id: string;
  created_by: string;
  name: string;
  status: string;
  clientId: string;
  created_at: string;
  updated_at: string;
  __v: number;
  count: number;
};

export type ToolData = {
  _id: string;
  created_by: string;
  name: string;
  website: string;
  logo: string;
  logoKey: string;
  logoName: string;
  status: string;
  clientId: string;
  created_at: string;
  updated_at: string;
  __v: number;
  type: {
    _id: string;
    created_by: string;
    name: string;
    status: string;
    clientId: string;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  category: {
    _id: string;
    created_by: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
    __v: number;
  };
};

export type ProductInfo = {
  _id: string;
  created_by: string;
  name: string;
  details: string;
  clientId: string;
  companyId: string;
  inv_generationDate: any;
  created_at: string;
  updated_at: string;
  __v: number;
  company: {
    _id: string;
    created_by: string;
    name: string;
    email: string;
    masterEmail: string;
    phone: string;
    userId: string;
    ein: string;
    addressId: string;
    clientId: string;
    billingInfoId: string;
    status: string;
    acc_contactId: string;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  contract: {
    _id: string;
    created_by: string;
    name: string;
    terminationReason: any;
    safeAgreementAmount: any;
    valuationCapitalAmount: any;
    discount: any;
    clientId: string;
    productId: string;
    rateSheetId: string;
    status: string;
    startDate: string;
    endDate: any;
    created_at: string;
    updated_at: string;
    __v: number;
  };
  ratesheet: {
    _id: string;
    created_by: string;
    name: string;
    startDate: string;
    endDate: any;
    status: string;
    clientId: string;
    created_at: string;
    updated_at: string;
    __v: number;
    roleCount: number;
  };
};

export type Categories = {
  _id: string;
  created_by: string;
  name: string;
  image: string;
  clientId: string;
  created_at: string;
  updated_at: string;
  __v: number;
};

export type TechnologiesByCategory = {
  categoryId: "662b4c1a0b8e7c936cbc0f91";
  categoryName: "What This Product Does";
  toolId: "66228d55aae1e76863378600";
  toolName: "Jira";
  logo: "https://pattern50.s3.amazonaws.com/Jira-logo_P50-m5gB.png";
};
