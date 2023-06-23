export interface User {
  userId: number;
  username: string;
  password?: string;
  displayName: string;
  userRole: string;
  branch_name: string;
  recordStatus: string;
  token?: string;
  createdTime: Date;
  createdBy: string;
  updatedTime: Date;
  updatedBy: string
}

// export interface UserPagination {
//   length: number;
//   size: number;
//   page: number;
//   lastPage: number;
//   startIndex: number;
//   endIndex: number;
// }


export interface Customer {
  cus_id: number;
  cus_member: string;
  cus_prefix: string;
  cus_full_name: string;
  cus_nick_name: string;
  cus_telephone: string
  cus_birthday: Date;
  cus_gender: string;
  cus_occupation: string;
  cus_status: string;
  cus_salary: string;
  cus_payment: string;
  cus_house_number: string;
  cus_moo: string;
  cus_soi: string;
  cus_road: string;
  provinceID: number;
  districtID: number;
  sub_districtID: number;
  postcodeID: number;
  congenital_disease: string;
  drug_allergy: string;
  recordStatus: string;
  createdTime: Date;
  createdBy: string;
  updatedTime: Date;
  updatedBy: string
}


export interface CustomerPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}
