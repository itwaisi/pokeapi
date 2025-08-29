import dotenv from 'dotenv';
dotenv.config();


export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_HOST: process.env.API_HOST || 'localhost',
    API_PORT: parseInt(process.env.API_PORT || '3000', 10),
    API_JWT_SECRET: process.env.API_JWT_SECRET || 'CHANGE_SECRET!',
    API_CACHE_TTL_SECONDS: parseInt(process.env.API_CACHE_TTL_SECONDS || '600', 10)
};
