import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import response from '../util/corparesponse.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return response(401, null, "Token tidak ditemukan", res);
    }
    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.tipe_user = decoded.tipe_user;
        next();
    } catch (error) {
        return response(403, null, "Token tidak valid", res);
    }
}

export const verifyOperator = (req, res, next) => {
    if(req.tipe_user !== "operator") {
        return response(403, null, "Akses terlarang, hanya operator yang diizinkan", res);
    }
    next();
}

export const verifyManager = (req, res, next) => {
    if(req.tipe_user !== "manager") {
        return response(403, null, "Akses terlarang, hanya manager yang diizinkan", res);
    }
    next();
}