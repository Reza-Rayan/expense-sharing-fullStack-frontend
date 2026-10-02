export interface BalanceUser {
    id: number;
    name: string;
}

export interface Balance {
    debtor: BalanceUser; // کسی که بدهکاره
    creditor: BalanceUser; // کسی که طلبکاره
    amount: number;
}