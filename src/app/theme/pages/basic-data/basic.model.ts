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
    sale_cut_id: number;
    sale_cut_count: number;
    sale_cut_vitamin: string;
    sale_cut_mark: string;
    sale_cut_therapist: number;
    sale_cut_doctor: string;
    sale_cut_pay_balance: number;
    sale_cut_pay: number;
    sale_cut_overdue: number;
    sale_cut_detail: string;
    sale_id: number;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}