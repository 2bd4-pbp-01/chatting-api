import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ msg: "Token tidak ditemukan" });
    }
    
    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.tipe_user = decoded.tipe_user;
        next();
    } catch (error) {
        return res.status(403).json({ msg: "Token tidak valid atau kadaluarsa" });
    }
}

export const verifyOperator = (req, res, next) => {
    if(req.tipe_user !== "operator") {
        return res.status(403).json({msg: "Akses terlarang, hanya operator yang diizinkan"});
    }
    next();
}

export const verifyManager = (req, res, next) => {
    if(req.tipe_user !== "manager") {
        return res.status(403).json({msg: "Akses terlarang, hanya manager yang diizinkan"});
    }
    next();
}