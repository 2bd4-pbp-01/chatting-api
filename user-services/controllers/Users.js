import User from "../models/UserModel.js";
import argon2 from "argon2";

// Get semua user (kecuali operator)
export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['id_users','username','email','tipe_user'],
            where: {
                tipe_user: ['anggota', 'manager'] // Hanya ambil anggota dan manager
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Get user by ID (kecuali operator)
export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['id_users','username','email','tipe_user'],
            where: {
                id_users: req.params.id
            }
        });
        if(!response) return res.status(404).json({msg: "User tidak ditemukan"});
        
        // Cek apakah user yang dicari adalah operator
        if(response.tipe_user === 'operator') {
            return res.status(403).json({msg: "Tidak dapat mengakses data operator"});
        }
        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Create user baru (hanya bisa buat anggota)
export const createUser = async(req, res) =>{
    const {username, email, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    
    try {
        // Cek email sudah terdaftar
        const existingUser = await User.findOne({
            where: { email: email }
        });
        if(existingUser) {
            return res.status(400).json({msg: "Email sudah terdaftar"});
        }

        const hashPassword = await argon2.hash(password);
        await User.create({
            username: username,
            email: email,
            password: hashPassword,
            tipe_user: "anggota" // Operator hanya bisa membuat anggota
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

// Update user (dengan batasan role)
export const updateUser = async(req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});

        // Cek jika user yang akan diupdate adalah operator
        if(user.tipe_user === 'operator') {
            return res.status(403).json({msg: "Tidak dapat mengubah data operator"});
        }

        const {username, email, tipe_user} = req.body;

        // Validasi tipe_user yang diperbolehkan
        if(tipe_user && !['anggota', 'manager'].includes(tipe_user)) {
            return res.status(400).json({msg: "Tipe user tidak valid. Hanya bisa set sebagai anggota atau manager"});
        }

        // Update tanpa mengubah password
        await User.update({
            username: username,
            email: email,
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

// Update password user
export const updatePassword = async(req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});

        // Cek jika user yang akan diupdate adalah operator
        if(user.tipe_user === 'operator') {
            return res.status(403).json({msg: "Tidak dapat mengubah data operator"});
        }

        const {password, confPassword} = req.body;
        if(!password) return res.status(400).json({msg: "Password harus diisi"});
        if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});

        const hashPassword = await argon2.hash(password);

        await User.update({
            password: hashPassword
        },{
            where:{
                id_users: user.id_users
            }
        });
        res.status(200).json({msg: "Password Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

// Delete user (tidak bisa delete operator)
export const deleteUser = async(req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});

        // Cek jika user yang akan dihapus adalah operator
        if(user.tipe_user === 'operator') {
            return res.status(403).json({msg: "Tidak dapat menghapus operator"});
        }

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

// Promote user menjadi manager
export const promoteToManager = async(req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});

        // Hanya bisa promote anggota
        if(user.tipe_user !== 'anggota') {
            return res.status(400).json({msg: "Hanya anggota yang dapat dipromosikan menjadi manager"});
        }

        await User.update({
            tipe_user: "manager"
        },{
            where:{
                id_users: user.id_users
            }
        });
        res.status(200).json({msg: "User berhasil dipromosikan menjadi manager"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

// Demote manager menjadi anggota
export const demoteToMember = async(req, res) =>{
    try {
        const user = await User.findOne({
            where: {
                id_users: req.params.id
            }
        });
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});

        // Hanya bisa demote manager
        if(user.tipe_user !== 'manager') {
            return res.status(400).json({msg: "Hanya manager yang dapat diturunkan menjadi anggota"});
        }

        await User.update({
            tipe_user: "anggota"
        },{
            where:{
                id_users: user.id_users
            }
        });
        res.status(200).json({msg: "Manager berhasil diturunkan menjadi anggota"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}