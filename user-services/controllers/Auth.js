import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import argon2 from "argon2";
import { jwtConfig } from "../config/jwt.js";
import response from "../util/corparesponse.js";    

// Login 
export const Login = async (req, res) => {
    let user; // Definisikan variabel user di luar blok try-catch-finally
    try {
        // Validasi input
        if (!req.body.email || !req.body.password) {
            return response(400, null, "Email dan password harus diisi", res);
        }

        // Mencari user berdasarkan email
        user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) return response(404, null, "User tidak ditemukan", res);

        // Memverifikasi password yang diberikan
        const match = await argon2.verify(user.password, req.body.password);
        if (!match) return response(400, null, "Password salah", res);

        // Membuat token JWT
        const token = jwt.sign({
            id: user.id_users,
            email: user.email,
            tipe_user: user.tipe_user
        }, jwtConfig.secret, {
            expiresIn: jwtConfig.expiration
        });

        // Menyiapkan data untuk respons
        const data = {
            token: token,
        }
        // Mengirim respons sukses dengan status 200
        response(200, data, "Login Berhasil", res);
    } catch (error) {
        // Menangkap kesalahan dan mengirim respons 500
        console.error("Error during login:", error);
        response(500, null, "Terjadi kesalahan pada server", res);
    } finally {
        if (user) {
            console.log(`Login attempt for user: ${user.email}`);
        } else {
            console.log("Login attempt failed before user retrieval.");
        }
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
        response(200, user, "User Ditemukan", res);
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


export const register = async (req, res) => {
    const { username, email, password, confPassword } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });

    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) return res.status(400).json({ msg: "Email sudah terdaftar" });

        const hashPassword = await argon2.hash(password);
        const user = await User.create({
            username: username,
            email: email,
            password: hashPassword,
            tipe_user: "anggota"
        });

        const token = jwt.sign({
            id: user.id_users,
            email: user.email,
            tipe_user: user.tipe_user
        }, jwtConfig.secret, {
            expiresIn: jwtConfig.expiration
        });

        const data = {
            token: token,
        }

        response(201, data, "Register Berhasil", res);

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
