export interface PageMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Paginated<T> {
    items: T[];
    meta: PageMeta;
}

export interface ApiErrorBody {
    statusCode: number;
    message: string | string[];
    error?: string;
}