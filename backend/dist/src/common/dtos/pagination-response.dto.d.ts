export declare class PaginationResponseDto<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    constructor(items: T[], total: number, page: number, limit: number);
}
