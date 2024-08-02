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
