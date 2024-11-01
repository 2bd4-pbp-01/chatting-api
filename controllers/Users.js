import User from "../models/UserModel.js";
import argon2 from "argon2";

// Otoritas dari admin untuk mendapatkan semua all user
export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['id_users','username','email','tipe_user']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Otoritas dari admin untuk mendapatkan semua all user
export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['id_users','username','email','tipe_user'],
            where: {
                id_users: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Otoritas dari admin untuk membuat user baru
export const createUser = async(req, res) =>{
    const {username, email, password, confPassword, tipe_user} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            username: username,
            email: email,
            password: hashPassword,
            tipe_user: tipe_user
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

// Otoritas dari admin untuk mengupdate user
export const updateUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            id_users: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    const {username, email, password, confPassword, tipe_user} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    try {
        await User.update({
            username: username,
            email: email,
            password: hashPassword,
            tipe_user: tipe_user
        },{
            where:{
                id_users: user.id_users
            }
        });
        res.status(200).json({msg: "User Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

// Otoritas dari admin untuk menghapus user
export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            id_users: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    try {
        await User.destroy({
            where:{
                id_users: user.id_users
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}