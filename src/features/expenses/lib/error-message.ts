import { ApiError } from '@/lib/api-client';

export function getCreateExpenseErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        // network failure: the message is already user-friendly and Persian
        if (error.status === 0) return error.message;
        if (error.status === 404) {
            return 'یکی از کاربران پیدا نشد. صفحه را رفرش کن و دوباره تلاش کن.';
        }
        if (error.status === 400) {
            return 'اطلاعات واردشده معتبر نیست. فرم را بررسی کن.';
        }
    }

    return 'ثبت هزینه ناموفق بود. دوباره تلاش کن.';
}