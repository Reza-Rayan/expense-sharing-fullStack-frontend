import {z} from 'zod';
import {formatNumber} from '@/lib/format';
import type {CreateExpensePayload} from '../types';

export const MAX_EXPENSE_AMOUNT = 1_000_000;

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export const toEnglishDigits = (value: string): string =>
    value
        .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
        .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
        .replace(/[\s,٬]/g, '')
        .replace(/٫/g, '.');

export const createExpenseSchema = z
    .object({
        paidById: z.string().min(1, 'پرداخت‌کننده را انتخاب کن'),
        paidForId: z.string().min(1, 'کسی که هزینه برای اوست را انتخاب کن'),
        amount: z
            .string()
            .trim()
            .min(1, 'مبلغ را وارد کن')
            .refine(
                (value) => /^\d+(\.\d{1,2})?$/.test(toEnglishDigits(value)),
                'مبلغ باید عدد باشد و حداکثر دو رقم اعشار داشته باشد',
            )
            .refine(
                (value) => Number(toEnglishDigits(value)) > 0,
                'مبلغ باید بیشتر از صفر باشد',
            )
            .refine(
                (value) => Number(toEnglishDigits(value)) <= MAX_EXPENSE_AMOUNT,
                `مبلغ نمی‌تواند بیشتر از ${formatNumber(MAX_EXPENSE_AMOUNT)} دلار باشد`,
            ),
        description: z
            .string()
            .trim()
            .min(1, 'توضیحات را وارد کن')
            .max(255, 'توضیحات نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد'),
    })
    .refine((values) => values.paidById !== values.paidForId, {
        message: 'پرداخت‌کننده و بدهکار نمی‌توانند یک نفر باشند',
        path: ['paidForId'],
    });

export type CreateExpenseFormValues = z.infer<typeof createExpenseSchema>;

export const toCreateExpensePayload = (
    values: CreateExpenseFormValues,
): CreateExpensePayload => ({
    paidById: Number(values.paidById),
    paidForId: Number(values.paidForId),
    amount: Number(toEnglishDigits(values.amount)),
    description: values.description,
});