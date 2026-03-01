// Application Environment
export const APP_ENV = process.env.APP_ENV || 'demo';

export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};

export const USER_STATUS = {
    PENDING: 'pending',
    ACTIVE: 'active',
};

export const USER_PLANS = {
    DAY_1: '1 day (Free)',
    DAYS_15: '15 days ($15)',
    DAYS_30: '30 days ($25)',
};

export const EXCHANGES = {
    BINANCE: 'binance',
    BYBIT: 'bybit',
    MEXC: 'mexc'
};
