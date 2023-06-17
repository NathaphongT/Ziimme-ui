export interface Course {
    course_id: number;
    course_code: string;
    course_name_th: string;
    course_name_eng: string;
    course_detail: string;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}

export interface Position {
    position_id: number;
    position_name_th: string;
    position_name_eng: string;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}

export interface Branch {
    branch_id: number;
    branch_code: string;
    branch_name_th: string;
    branch_name_eng: string;
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

export interface Sale {
    sale_id: number;
    sale_number: number;
    sale_consultant: number;
    sale_product: number;
    sale_count: number;
    sale_pay_balance: number;
    sale_pay: number;
    sale_overdue: number;
    cus_id: number;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string

    emp_id?: SaleEmployee[];
}

export interface SaleEmployee {
    consultant_id: number;
    sale_id: number;
    emp_id: number;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
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