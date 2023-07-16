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

export interface Customer {
  cusId: number;
  cusMember: string;
  cusPrefix: string;
  cusFullName: string;
  cusNickName: string;
  cusTelephone: string
  cusBirthday: Date;
  cusGender: string;
  cusOccupation: string;
  cusStatus: string;
  cusSalary: string;
  cusPayment: string;
  cusHouseNumber: string;
  cusMoo: string;
  cusSoi: string;
  cusRoad: string;
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

export interface SaleList {
  saleId: number;
  empFullname: string;
  cusId: number;
  saleNumber: number;
  saleProduct: number;
  saleCount: number;
  salePayBalance: number;
  salePay: number;
  saleOverdue: number;
}

export interface SaleListEmp {
  saleNumber: number;
  salePayBalance: number;
  cusFullName: string;
  courseCode: string;
  empId: number;
  empFullname: string;
}