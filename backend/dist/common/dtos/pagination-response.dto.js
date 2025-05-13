"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationResponseDto = void 0;
class PaginationResponseDto {
    constructor(items, total, page, limit) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(total / limit);
        this.hasNext = page < this.totalPages;
        this.hasPrevious = page > 1;
    }
}
exports.PaginationResponseDto = PaginationResponseDto;
//# sourceMappingURL=pagination-response.dto.js.map