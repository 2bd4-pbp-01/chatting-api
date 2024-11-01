import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import argon2 from "argon2";
import { jwtConfig } from "../config/jwt.js";

// Login 
export const Login = async (req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        
        const match = await argon2.verify(user.password, req.body.password);
        if(!match) return res.status(400).json({msg: "Password salah"});
        
        // Create JWT token
        const token = jwt.sign({
            id: user.id_users,
            email: user.email,
            tipe_user: user.tipe_user
        }, jwtConfig.secret, {
            expiresIn: jwtConfig.expiration
        });

        res.status(200).json({
            msg: "Login berhasil",
            token: token,
            user: {
                id: user.id_users,
                username: user.username,
                email: user.email,
                tipe_user: user.tipe_user
            }
        });
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Get Current User Profile
export const getMe = async (req, res) =>{
    try {
        const user = await User.findOne({
            attributes: ['id_users', 'username', 'email', 'tipe_user'],
            where: {
                id_users: req.userId // This comes from verifyToken middleware
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        res.status(200).json({
            user: user
        });
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "Tidak dapat logout"});
        res.status(200).json({msg: "Anda telah logout"});
    });
}

//REGISTER
// export const register = async(req, res) =>{
//     const {username, email, password, confPassword, tipe_user} = req.body;
//     if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
//     const hashPassword = await argon2.hash(password);
//     try {
//         await User.create({
//             username: username,
//             email: email,
//             password: hashPassword,
//             tipe_user: tipe_user
//         });
//         res.status(201).json({msg: "Register Berhasil"});
//     } catch (error) {
//         res.status(400).json({msg: error.message});
//     }
// }

export const register = async(req, res) =>{
    const {username, email, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    
    try {
        // Check if email already exists
        const existingUser = await User.findOne({
            where: { email: email }
        });
        if(existingUser) {
            return res.status(400).json({msg: "Email sudah terdaftar"});
        }

        const hashPassword = await argon2.hash(password);
        const user = await User.create({
            username: username,
            email: email,
            password: hashPassword,
            tipe_user: "anggota"
        });

        // Create JWT token
        const token = jwt.sign({
            id: user.id_users,
            email: user.email,
            tipe_user: user.tipe_user
        }, jwtConfig.secret, {
            expiresIn: jwtConfig.expiration
        });

        res.status(201).json({
            msg: "Register Berhasil",
            token: token
        });
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
