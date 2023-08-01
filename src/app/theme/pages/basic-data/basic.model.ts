export interface Course {
    courseId: number;
    courseCode: string;
    courseNameTh: string;
    courseNameEng: string;
    courseDetail: string;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}

export interface Position {
    positionId: number;
    positionNameTh: string;
    positionNameEng: string;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}

export interface Branch {
    branchId: number;
    branchCode: string;
    branchNameTh: string;
    branchNameEng: string;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}

export interface Province {
    province_id: number;
    province_name_th: string;
    province_name_eng: string;
}

export interface Districts {
    districts_id: number;
    districts_name_th: string;
    districts_name_eng: string;
    province_code: number;
}

export interface SubDistricts {
    sub_districts_id: number;
    zip_code: string;
    sub_districts_name_th: string;
    sub_districts_name_eng: string;
    districts_code: number;
}

export interface PostCode {
    postcode_id: number;
    postcode_code: string;
    record_status: string;
    created_time: Date;
    updated_time: Date;
    sub_districts_id: number;
}

export interface Salary {
    id: number;
    salary: string;
}

export interface SaleCut {
    saleCutId: number;
    saleCutCourse: string;
    saleCutCount: string;
    saleCount: number;
    saleCutVitamin: string;
    saleCutMark: string;
    saleCutTherapist: number;
    saleCutDoctor: string;
    saleCutDetail: string;
    saleCutDate: Date;
    saleId: number;
    saleProductId: number;
    courseId: number;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}

export interface SalePay {
    salePayId: number;
    salePayCourse: string;
    saleExtraPay: string;
    salePayBaLance: number;
    salePayOver: string;
    saleId: number;
    cusId: number;
    saleProductId: number;
    courseId: number;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}