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
  cusBranch: number;
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
  saleProductId: number;
  saleId: number;
  cusId: number;
  courseId: number;
  saleCount: number;
  saleCutCount: number;
  saleNumber: number;
  courseCode: string;
  courseNameTh: string;
  empFullname: string;
  saleBalance: string;
  salePayment: string;
  saleOverdue: string;
  saleExtraPay: number;
  salePayOver: string;
  saleDetail: string;
  saleDate: Date;
  saleCutDownDetail: string;
  saleStatus: string;
}

export interface SaleListEmp {
  saleNumber: number;
  saleBalance: number;
  cusFullName: string;
  cusMember: string;
  cusBranch: string;
  courseId: string;
  empId: number;
  saleId: number;
  saleDate: Date;
  courseNameEng: string;
  courseCode: string;
  courseNameTh: string;
}