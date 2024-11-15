# chatting-api


## Paradigma fungsional dalam direktori user-services dapat dilihat dari beberapa aspek berikut:

1. Penggunaan Fungsi Murni:
Fungsi-fungsi dalam controller seperti getGroups, getGroupsById, createGroup, dll., berusaha untuk tidak memiliki side effect dan mengembalikan hasil yang sama untuk input yang sama.

2. Immutability:
Data yang diterima oleh fungsi tidak diubah secara langsung. Sebagai contoh, dalam fungsi createGroup, data yang diterima dari request body digunakan untuk membuat entitas baru tanpa mengubah data asli.

3. Komposisi Fungsi:
Middleware seperti verifyToken, verifyOperator, dan verifyManager digunakan untuk memproses request secara berurutan sebelum mencapai fungsi handler utama. Ini menunjukkan komposisi fungsi di mana hasil dari satu fungsi diteruskan ke fungsi berikutnya.

4. Deklaratif:
Kode lebih fokus pada "apa" yang harus dilakukan daripada "bagaimana" melakukannya. Misalnya, penggunaan ORM Sequelize untuk query database lebih deklaratif dibandingkan dengan menulis query SQL secara langsung.


### Contoh penggunaan paradigma fungsional dalam user-services:

1. Middleware untuk Verifikasi Token
Middleware ini adalah fungsi murni yang memverifikasi token JWT dan menambahkan informasi pengguna ke objek request.
```javascript
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
```
2. Controller untuk Mendapatkan Grup Berdasarkan ID
Fungsi ini adalah fungsi asinkron yang mengambil data grup dari database dan mengembalikannya sebagai respons JSON.
```javascript
import { Op } from "sequelize";
import Groups from "../models/GroupModel.js";
import Users from "../models/UserModel.js";

export const getGroupsById = async (req, res) => {
    const { groupId: id, groupName: name = "" } = req.params;

    try {
        const group = await Groups.findOne({
            where: {
                [Op.or]: [{ id_group: Number(id) }, { name }],
            },
            include: [
                {
                    model: Users,
                    attributes: ["id_users", "username", "tipe_user"],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        group
            ? res.status(200).json(group)
            : res.status(404).json({ msg: "Group tidak ditemukan" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
```
3. Contoh Penggunaan Middleware dan Controller dalam Rute
Rute ini menggunakan middleware verifyToken dan verifyManager sebelum memanggil fungsi handler getGroupsById.
```javascript
import express from "express";
import { getGroupsById } from "../controllers/Groups.js";
import { verifyToken, verifyManager } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/groups/:groupId", verifyToken, verifyManager, getGroupsById);

export default router;
```
4. Konfigurasi JWT
Konfigurasi JWT menggunakan variabel lingkungan untuk menyimpan rahasia dan waktu kedaluwarsa token.
```javascript
import dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRE || '24h'
};
```
5. Contoh Penggunaan JWT dalam Fungsi Login
Fungsi ini membuat token JWT setelah memverifikasi kredensial pengguna.
```javascript
import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import argon2 from "argon2";
import { jwtConfig } from "../config/jwt.js";
import response from "../util/corparesponse.js";    

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
        const data = {
            token: token,
        }
        response(200, data, "Login Berhasil", res);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
```