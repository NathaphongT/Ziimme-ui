export interface PaginationResponse {
    currentPage: number;
    data: any;
    totalItems: number;
    totalPages: number;
}

export interface SalePagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}