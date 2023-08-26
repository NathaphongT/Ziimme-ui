export interface Employee {
    saleId: any;
    empId: number;
    empFullname: string;
    empNickname: string;
    empBirthday: Date;
    empTelephone: string;
    empEmail: string;
    empStatus: string;
    empPosition: number;
    empBranch: number;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}

export interface Sale {
    saleId: number;
    saleNumbder: string;
    saleConsultant: number;
    saleProduct: number;
    saleCount: number;
    saleBalance: string;
    salePayment: string;
    saleOverdue: string;
    saleDate: Date;
    cusId: number;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string

    empId?: SaleEmployee[];
    courseId?: SaleProducts[];
}

export interface SaleEmployee {
    consultantId: number;
    saleId: number;
    empId: number;
    cusId: number;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}

export interface SaleProducts {
    saleProductId: number;
    saleId: number;
    courseId: number;
    cusId: number;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string
}