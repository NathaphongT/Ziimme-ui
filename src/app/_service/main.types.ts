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
    saleNumbder: number;
    saleConsultant: number;
    saleProduct: number;
    saleCount: number;
    salePayBalance: number;
    salePay: number;
    saleOverdue: number;
    cusId: number;
    recordStatus: string;
    createdTime: Date;
    createdBy: string;
    updatedTime: Date;
    updatedBy: string

    empId?: SaleEmployee[];
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