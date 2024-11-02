import dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRE || '24h'
};